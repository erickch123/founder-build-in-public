import {z} from 'zod';
import {FounderEventSchema, type FounderEvent} from '../domain/schemas.js';
import {normalizeCapture} from '../domain/normalize-event.js';
import {readPrivateJson, writePrivateJson} from '../store/local-store.js';

const fileName = 'manual-captures.json';
const confidentialWorkspaceIds = new Set(['employment', 'cadt', 'fulltime', 'full-time', 'work']);

interface CreateManualCaptureInput {
  userId: string;
  workspaceId: string;
  text: string;
  tags?: string[];
  publicRequested: boolean;
}

export const isConfidentialWorkspace = (workspaceId: string): boolean =>
  confidentialWorkspaceIds.has(workspaceId.trim().toLowerCase());

export const createManualCapture = (
  input: CreateManualCaptureInput,
  now = new Date(),
): FounderEvent => {
  const confidential = isConfidentialWorkspace(input.workspaceId);
  if (confidential && input.publicRequested) {
    throw new Error(`Workspace "${input.workspaceId}" is confidential and cannot use --public.`);
  }
  const occurredAt = now.toISOString();
  return normalizeCapture({
    id: `evt_manual_${occurredAt.replace(/\D/g, '')}`,
    userId: input.userId,
    workspaceId: input.workspaceId,
    occurredAt,
    summary: input.text,
    visibility: confidential ? 'confidential' : input.publicRequested ? 'public-review' : 'private',
    ...(input.tags ? {tags: input.tags} : {}),
  });
};

export const readManualCaptures = async (userId: string): Promise<FounderEvent[]> => {
  try {
    return z.array(FounderEventSchema).parse(await readPrivateJson<unknown>(userId, fileName));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
};

export const appendManualCapture = async (userId: string, capture: FounderEvent): Promise<string> => {
  const existing = await readManualCaptures(userId);
  return writePrivateJson(userId, fileName, [...existing, capture]);
};
