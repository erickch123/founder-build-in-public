import {z} from 'zod';
import {LearningItemSchema, SourceItemSchema, type LearningItem, type SourceItem} from '../domain/schemas.js';
import {readPrivateJson, writePrivateJson} from '../store/local-store.js';

const ManualReflectionSchema = z.object({
  createdAt: z.string().datetime({offset: true}),
  learning: LearningItemSchema,
});

export type ManualReflection = z.infer<typeof ManualReflectionSchema>;

interface CreateReflectionInput {
  topic: string;
  text: string;
  whyItMatters: string;
  nextAction?: string;
  publicSafe: boolean;
}

const fileName = 'manual-reflections.json';

export const createManualReflection = (input: CreateReflectionInput, now = new Date()): ManualReflection => {
  const createdAt = now.toISOString();
  const suffix = createdAt.replace(/\D/g, '');
  const id = `reflect_${suffix}`;
  return ManualReflectionSchema.parse({
    createdAt,
    learning: {
      id,
      sourceIds: [`manual_${suffix}`],
      topic: input.topic,
      keyPoints: [input.text],
      whatILearned: input.text,
      whyItMatters: input.whyItMatters,
      nextActions: input.nextAction
        ? [{text: input.nextAction, timeHorizon: 'later', scheduleCandidate: false}]
        : [],
      publicSafe: input.publicSafe,
    },
  });
};

export const readManualReflections = async (userId: string): Promise<ManualReflection[]> => {
  try {
    return z.array(ManualReflectionSchema).parse(await readPrivateJson<unknown>(userId, fileName));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
};

export const appendManualReflection = async (userId: string, reflection: ManualReflection): Promise<string> => {
  const existing = await readManualReflections(userId);
  return writePrivateJson(userId, fileName, [...existing, reflection]);
};

export const reflectionEvidence = (reflections: ManualReflection[]): {
  learnings: LearningItem[];
  sources: SourceItem[];
} => ({
  learnings: reflections.map(({learning}) => learning),
  sources: reflections.map(({createdAt, learning}) => SourceItemSchema.parse({
    id: learning.sourceIds[0],
    sourceType: 'manual',
    sourceRef: `manual-reflection:${learning.id}`,
    receivedAt: createdAt,
    title: learning.topic,
    senderDisplay: 'Founder reflection',
    cleanText: learning.whatILearned,
    selected: true,
    workspaceHint: 'learning',
    visibility: learning.publicSafe ? 'public-review' : 'private',
  })),
});

export const mergeLearnings = (generated: LearningItem[], manual: LearningItem[]): LearningItem[] => {
  const byId = new Map(generated.map((learning) => [learning.id, learning]));
  manual.forEach((learning) => byId.set(learning.id, learning));
  return [...byId.values()];
};
