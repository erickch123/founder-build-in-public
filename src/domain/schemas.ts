import {z} from 'zod';

export const WorkspaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['employment', 'venture', 'side-project', 'creative', 'learning', 'personal', 'aggregate']),
  visibility: z.enum(['confidential', 'private', 'public-review']),
  aggregateIntoDefault: z.boolean(),
  allowPublicOutput: z.boolean(),
});

export const SourceItemSchema = z.object({
  id: z.string().min(1),
  sourceType: z.enum(['fixture-newsletter', 'gmail', 'manual']),
  sourceRef: z.string().min(1),
  receivedAt: z.string().datetime({offset: true}),
  title: z.string().min(1),
  senderDisplay: z.string().min(1),
  cleanText: z.string().min(1),
  selected: z.boolean(),
  workspaceHint: z.string().min(1),
  visibility: z.enum(['confidential', 'private', 'public-review']),
});

export const FounderEventSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  workspaceId: z.string().min(1),
  occurredAt: z.string().datetime({offset: true}),
  eventType: z.enum(['source_newsletter', 'personal_activity', 'learning', 'build_progress', 'decision', 'blocker', 'next_action']),
  summary: z.string().min(1),
  sourceIds: z.array(z.string()),
  visibility: z.enum(['confidential', 'private', 'public-review']),
  confidence: z.number().min(0).max(1),
  tags: z.array(z.string()),
});

export const LearningItemSchema = z.object({
  id: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  topic: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(1),
  whatILearned: z.string().min(1),
  whyItMatters: z.string().min(1),
  nextActions: z.array(z.object({
    text: z.string().min(1),
    timeHorizon: z.enum(['today', 'tomorrow', 'next-week', 'later']),
    scheduleCandidate: z.boolean(),
  })),
  publicSafe: z.boolean(),
});

export const PublicManifestSchema = z.object({
  date: z.string().date(),
  userDisplay: z.string().min(1),
  themeCandidates: z.array(z.string().min(1)),
  events: z.array(z.object({
    id: z.string().min(1),
    workspaceLabel: z.string().min(1),
    summary: z.string().min(1),
    sourceEventIds: z.array(z.string()),
  })),
  learnings: z.array(z.object({
    id: z.string().min(1),
    summary: z.string().min(1),
    sourceLearningIds: z.array(z.string()),
  })),
  disclosure: z.object({
    fixtureSources: z.number().int().nonnegative(),
    manualCaptures: z.number().int().nonnegative(),
    statement: z.string().min(1),
  }),
});

export const SceneSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['hook', 'moments', 'problem', 'terminal', 'outputs', 'highlights', 'lesson', 'reveal']),
  durationSeconds: z.number().int().positive(),
  headline: z.string().min(1),
  body: z.string().min(1),
  narration: z.string().min(1),
  evidenceIds: z.array(z.string()),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const StoryPlanSchema = z.object({
  title: z.string().min(1),
  theme: z.string().min(1),
  hook: z.string().min(1),
  founderLesson: z.string().min(1),
  nextStep: z.string().min(1),
  targetDurationSeconds: z.number().int().min(45).max(60),
  voiceover: z.string().min(1),
  scenes: z.array(SceneSchema).min(5).max(7),
}).superRefine((plan, context) => {
  const duration = plan.scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0);
  if (duration !== plan.targetDurationSeconds) {
    context.addIssue({code: 'custom', message: `Scene duration ${duration}s does not match target ${plan.targetDurationSeconds}s`});
  }
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
export type SourceItem = z.infer<typeof SourceItemSchema>;
export type FounderEvent = z.infer<typeof FounderEventSchema>;
export type LearningItem = z.infer<typeof LearningItemSchema>;
export type PublicManifest = z.infer<typeof PublicManifestSchema>;
export type StoryPlan = z.infer<typeof StoryPlanSchema>;
