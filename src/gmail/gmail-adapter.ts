import {google, type gmail_v1} from 'googleapis';
import {createServer} from 'node:http';
import {SourceItemSchema, type SourceItem} from '../domain/schemas.js';
import {readCredentialJson, writeCredentialJson} from '../store/local-store.js';

export const GMAIL_READONLY_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

export interface GmailCandidate {
  messageId: string;
  subject: string;
  sender: string;
  receivedAt: string;
  snippet: string;
}

const oauthClient = () => {
  const {GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET} = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET) {
    throw new Error('Gmail requires GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET from a Google OAuth desktop client.');
  }
  return new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, 'http://127.0.0.1:53682/oauth2callback');
};

const gmailClient = async () => {
  const auth = oauthClient();
  let refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!refreshToken) {
    try {
      refreshToken = (await readCredentialJson<{refreshToken: string}>('gmail-token.json')).refreshToken;
    } catch {
      throw new Error('Gmail is not authorized. Run: npm run founder -- <user> learning gmail-auth');
    }
  }
  auth.setCredentials({refresh_token: refreshToken, scope: GMAIL_READONLY_SCOPE});
  return google.gmail({version: 'v1', auth});
};

export const authorizeGmail = async (): Promise<string> => {
  const auth = oauthClient();
  const url = auth.generateAuthUrl({access_type: 'offline', prompt: 'consent', scope: [GMAIL_READONLY_SCOPE]});
  console.log(`Open this URL to authorize Gmail read-only access:\n\n${url}\n`);
  const code = await new Promise<string>((resolveCode, reject) => {
    const server = createServer((request, response) => {
      const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1:53682');
      if (requestUrl.pathname !== '/oauth2callback') {response.writeHead(404).end(); return;}
      const error = requestUrl.searchParams.get('error');
      const value = requestUrl.searchParams.get('code');
      if (error || !value) {response.writeHead(400).end('Authorization failed. Return to the terminal.'); server.close(); reject(new Error(error || 'Missing OAuth code.')); return;}
      response.writeHead(200, {'Content-Type': 'text/plain'}).end('Gmail read-only authorization complete. You may close this tab.');
      server.close(); resolveCode(value);
    });
    server.on('error', reject);
    server.listen(53682, '127.0.0.1');
    setTimeout(() => {server.close(); reject(new Error('Gmail authorization timed out after five minutes.'));}, 300_000).unref();
  });
  const {tokens} = await auth.getToken(code);
  if (!tokens.refresh_token) throw new Error('Google did not return a refresh token. Revoke prior access and run gmail-auth again.');
  return writeCredentialJson('gmail-token.json', {refreshToken: tokens.refresh_token, scope: GMAIL_READONLY_SCOPE, createdAt: new Date().toISOString()});
};

const header = (headers: gmail_v1.Schema$MessagePartHeader[] | undefined, name: string): string =>
  headers?.find((item) => item.name?.toLowerCase() === name.toLowerCase())?.value ?? '';

export const listNewsletterCandidates = async (query?: string): Promise<GmailCandidate[]> => {
  const gmail = await gmailClient();
  const response = await gmail.users.messages.list({
    userId: 'me', maxResults: 20,
    q: query || 'newer_than:2d {from:medium.com from:substack.com label:newsletters}',
  });
  return Promise.all((response.data.messages ?? []).map(async ({id}) => {
    if (!id) throw new Error('Gmail returned a candidate without an ID.');
    const message = await gmail.users.messages.get({userId: 'me', id, format: 'metadata', metadataHeaders: ['Subject', 'From', 'Date']});
    const headers = message.data.payload?.headers;
    return {
      messageId: id,
      subject: header(headers, 'Subject') || '(no subject)',
      sender: header(headers, 'From') || '(unknown sender)',
      receivedAt: header(headers, 'Date') || new Date(Number(message.data.internalDate ?? Date.now())).toISOString(),
      snippet: message.data.snippet ?? '',
    };
  }));
};

const decode = (data?: string | null): string => data
  ? Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
  : '';

const bodyText = (part?: gmail_v1.Schema$MessagePart): string => {
  if (!part) return '';
  if (part.mimeType === 'text/plain') return decode(part.body?.data);
  const children = (part.parts ?? []).map(bodyText).filter(Boolean).join('\n');
  if (children) return children;
  if (part.mimeType === 'text/html') return decode(part.body?.data).replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
  return '';
};

export const fetchSelectedNewsletters = async (candidates: GmailCandidate[]): Promise<SourceItem[]> => {
  const gmail = await gmailClient();
  return Promise.all(candidates.map(async (candidate, index) => {
    const response = await gmail.users.messages.get({userId: 'me', id: candidate.messageId, format: 'full'});
    const cleanText = bodyText(response.data.payload).replace(/\s+/g, ' ').trim().slice(0, 12_000);
    if (!cleanText) throw new Error(`No readable body found for Gmail candidate ${index + 1}.`);
    return SourceItemSchema.parse({
      id: `src_gmail_${String(index + 1).padStart(3, '0')}`,
      sourceType: 'gmail', sourceRef: candidate.messageId,
      receivedAt: new Date(candidate.receivedAt).toISOString(),
      title: candidate.subject, senderDisplay: candidate.sender,
      cleanText, selected: true, workspaceHint: 'learning', visibility: 'private',
    });
  }));
};
