import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {z} from 'zod';
import {
  FounderEventSchema,
  LearningItemSchema,
  SourceItemSchema,
  WorkspaceSchema,
} from '../domain/schemas.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(here, '../../fixtures/demo');

const readFixture = async (name: string): Promise<unknown> =>
  JSON.parse(await readFile(resolve(fixtureRoot, name), 'utf8')) as unknown;

export const loadDemoFixture = async () => ({
  date: '2026-07-12',
  workspaces: z.array(WorkspaceSchema).parse(await readFixture('workspaces.json')),
  sources: z.array(SourceItemSchema).parse(await readFixture('sources.json')),
  events: z.array(FounderEventSchema).parse(await readFixture('events.json')),
  learnings: z.array(LearningItemSchema).parse(await readFixture('learnings.json')),
});
