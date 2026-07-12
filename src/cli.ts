#!/usr/bin/env node
import 'dotenv/config';
import {runEndDay} from './pipeline/end-day.js';
import {extractLearningWithOpenAI} from './ai/openai-provider.js';
import {authorizeGmail, fetchSelectedNewsletters, listNewsletterCandidates, type GmailCandidate} from './gmail/gmail-adapter.js';
import {exportLearningToNotion} from './notion/notion-export.js';
import {readPrivateJson, singaporeDate, writePrivateJson} from './store/local-store.js';
import type {LearningItem, SourceItem} from './domain/schemas.js';
import {loadDemoFixture} from './fixtures/load-demo-fixture.js';

const args = process.argv.slice(2);
const [userArg, workspaceArg, commandArg] = args;
const fixture = args.includes('--fixture');
const ai = args.includes('--ai');
const notion = args.includes('--notion');
const live = args.includes('--live');
const storageIndex = args.indexOf('--storage');
const storage = storageIndex >= 0 ? args[storageIndex + 1] : 'local';

const usage = (): never => {
  console.error('Usage: founder <user> <workspace> end-day --fixture --storage local');
  process.exit(1);
};

if (!userArg || !workspaceArg || !commandArg) usage();
const userId = userArg as string;
const workspaceId = workspaceArg as string;
const command = commandArg as string;
try {
  if (workspaceId === 'learning' && command === 'gmail-auth') {
    const path = await authorizeGmail();
    console.log(`✓ Gmail read-only token saved privately\nCredential  ${path}`);
    process.exit(0);
  }
  if (workspaceId === 'learning' && command === 'inbox') {
    if (!live) throw new Error('Use --live for Gmail or use the fixture end-day demo.');
    const queryIndex = args.indexOf('--query');
    const candidates = await listNewsletterCandidates(queryIndex >= 0 ? args[queryIndex + 1] : undefined);
    const path = await writePrivateJson(userId, 'gmail-candidates.json', candidates);
    console.log(`Newsletter candidates — ${candidates.length}\n`);
    candidates.forEach((item, index) => console.log(`${index + 1}. ${item.subject}\n   ${item.sender}`));
    console.log(`\nPrivate candidate index  ${path}`);
    process.exit(0);
  }
  if (workspaceId === 'learning' && command === 'select') {
    const idsIndex = args.indexOf('--ids');
    const selectedNumbers = (idsIndex >= 0 ? args[idsIndex + 1] ?? '' : '').split(',').map(Number).filter(Number.isInteger);
    if (selectedNumbers.length === 0) throw new Error('select requires --ids 1,2,...');
    const candidates = await readPrivateJson<GmailCandidate[]>(userId, 'gmail-candidates.json');
    const chosen = selectedNumbers.map((number) => candidates[number - 1]).filter((item): item is GmailCandidate => Boolean(item));
    if (chosen.length !== selectedNumbers.length) throw new Error('One or more selected IDs are outside the candidate list.');
    const sources = await fetchSelectedNewsletters(chosen);
    const path = await writePrivateJson(userId, 'selected-sources.json', sources);
    console.log(`✓ Saved ${sources.length} selected newsletters privately\nSelected sources  ${path}`);
    process.exit(0);
  }
  if (workspaceId === 'learning' && command === 'sync-notion') {
    let learnings: LearningItem[];
    if (fixture) {
      learnings = (await loadDemoFixture()).learnings;
    } else {
      try {
        learnings = await readPrivateJson<LearningItem[]>(userId, 'learning-log.json');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          throw new Error('No local learning log found. Run `digest --ai` first, or add --fixture to export the sanitized fixture learnings.');
        }
        throw error;
      }
    }
    const url = await exportLearningToNotion(singaporeDate(), learnings);
    console.log(`✓ Exported ${learnings.length} learnings to Notion\nNotion  ${url}`);
    process.exit(0);
  }
  if (workspaceId === 'learning' && command === 'digest') {
    if (!ai) throw new Error('Live learning digest currently requires --ai.');
    let sources: SourceItem[];
    if (fixture) {
      sources = (await loadDemoFixture()).sources.filter((source) => source.selected);
      console.log(`✓ Loaded ${sources.length} sanitized fixture sources`);
    } else {
      try {
        sources = await readPrivateJson<SourceItem[]>(userId, 'selected-sources.json');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          throw new Error('No selected Gmail sources found. Run `inbox --live` and `select --ids ...` first, or add --fixture to test OpenAI and Notion without Gmail.');
        }
        throw error;
      }
    }
    const learnings = await extractLearningWithOpenAI(sources);
    const path = await writePrivateJson(userId, 'learning-log.json', learnings);
    console.log(`✓ Extracted ${learnings.length} structured learnings with OpenAI`);
    console.log(`Learning log  ${path}`);
    if (notion) {
      try {
        const url = await exportLearningToNotion(singaporeDate(), learnings);
        console.log(`Notion        ${url}`);
      } catch (error) {
        console.warn(`Warning: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    process.exit(0);
  }
  if (command !== 'end-day') throw new Error(`Unsupported command: ${command}`);
  if (storage !== 'local') throw new Error('Only local storage is implemented in the golden path.');
  console.log('Founder Build in Public — fixture golden path\n');
  console.log('… Loading sanitized, user-curated fixture evidence');
  const result = await runEndDay({userId, workspaceId, fixture, storage: 'local', ai});
  console.log('✓ Loaded 3 sanitized, user-curated newsletter fixtures');
  console.log(`✓ Excluded ${result.excludedConfidentialEvents} confidential workspace event`);
  console.log(`✓ Selected story: ${result.storyTitle}`);
  console.log('✓ Generated Founder Digest');
  console.log(`✓ Rendered ${result.durationSeconds}-second Founder Reel`);
  console.log(`\nDigest  ${result.digestPath}`);
  console.log(`Video   ${result.videoPath}`);
  console.log(`Mode    fixture · ${ai ? 'OpenAI structured output' : 'deterministic fallback'} · local storage · ${result.narrated ? `narrated (${result.voiceProvider})` : 'caption-led'}`);
} catch (error) {
  console.error(`\nError: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
