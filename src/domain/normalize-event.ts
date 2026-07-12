import {FounderEventSchema, type FounderEvent} from './schemas.js';

export interface CaptureInput {
  id: string;
  userId: string;
  workspaceId: string;
  occurredAt: string;
  summary: string;
  visibility: FounderEvent['visibility'];
  tags?: string[];
}

export const normalizeCapture = (input: CaptureInput): FounderEvent => FounderEventSchema.parse({
  id: input.id.trim().toLowerCase(),
  userId: input.userId.trim().toLowerCase(),
  workspaceId: input.workspaceId.trim().toLowerCase(),
  occurredAt: input.occurredAt,
  eventType: 'build_progress',
  summary: input.summary.trim().replace(/\s+/g, ' '),
  sourceIds: [],
  visibility: input.visibility,
  confidence: 1,
  tags: (input.tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean),
});
