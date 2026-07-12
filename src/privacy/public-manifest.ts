import {
  PublicManifestSchema,
  type FounderEvent,
  type LearningItem,
  type PublicManifest,
  type SourceItem,
  type Workspace,
} from '../domain/schemas.js';

const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const URL = /https?:\/\/\S+/gi;
const SECRET = /\b(?:sk|token|secret|password)[-_:=][A-Za-z0-9_-]+\b/gi;

export const sanitizePublicText = (value: string): string => value
  .replace(EMAIL, '[email removed]')
  .replace(URL, '[link removed]')
  .replace(SECRET, '[secret removed]')
  .replace(/\s+/g, ' ')
  .trim();

interface ManifestInput {
  date: string;
  userDisplay: string;
  events: FounderEvent[];
  learnings: LearningItem[];
  sources: SourceItem[];
  workspaces: Workspace[];
}

export const buildPublicManifest = (input: ManifestInput): PublicManifest => {
  const workspaceById = new Map(input.workspaces.map((workspace) => [workspace.id, workspace]));
  const allowedEvents = input.events.filter((event) => {
    const workspace = workspaceById.get(event.workspaceId);
    return workspace?.allowPublicOutput === true
      && workspace.visibility === 'public-review'
      && event.visibility === 'public-review';
  });

  const allowedSourceIds = new Set(
    input.sources
      .filter((source) => source.selected && source.visibility !== 'confidential')
      .map((source) => source.id),
  );

  const allowedLearnings = input.learnings.filter((learning) =>
    learning.publicSafe && learning.sourceIds.every((id) => allowedSourceIds.has(id)),
  );

  return PublicManifestSchema.parse({
    date: input.date,
    userDisplay: sanitizePublicText(input.userDisplay),
    themeCandidates: ['From consuming information to building with it'],
    events: allowedEvents.map((event, index) => ({
      id: `evt_public_${String(index + 1).padStart(3, '0')}`,
      workspaceLabel: workspaceById.get(event.workspaceId)?.name ?? 'Founder work',
      summary: sanitizePublicText(event.summary),
      sourceEventIds: [event.id],
    })),
    learnings: allowedLearnings.map((learning, index) => ({
      id: `learn_public_${String(index + 1).padStart(3, '0')}`,
      summary: sanitizePublicText(learning.whatILearned),
      sourceLearningIds: [learning.id],
    })),
    disclosure: {
      fixtureSources: input.sources.filter((source) => source.sourceType === 'fixture-newsletter' && source.selected).length,
      manualCaptures: input.events.filter((event) => event.sourceIds.length === 0).length,
      statement: 'Generated from synthetic newsletter fixtures and sanitized founder captures.',
    },
  });
};
