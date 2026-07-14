import {afterEach, describe, expect, it, vi} from 'vitest';
import {exportLearningToNotion} from '../src/notion/notion-export.js';
import type {LearningItem} from '../src/domain/schemas.js';
import {singaporeTimestamp} from '../src/store/local-store.js';

const learning: LearningItem = {
  id: 'learn_001', sourceIds: ['src_001'], topic: 'Agent governance',
  keyPoints: ['Use explicit controls'], whatILearned: 'Govern the harness.',
  whyItMatters: 'Public output needs boundaries.',
  nextActions: [{text: 'Add an approval gate', timeHorizon: 'next-week', scheduleCandidate: true}],
  publicSafe: true,
};

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.NOTION_API_KEY;
  delete process.env.NOTION_PARENT_PAGE_ID;
});

describe('Notion learning export', () => {
  it('formats page timestamps in Singapore time', () => {
    expect(singaporeTimestamp(new Date('2026-07-12T10:34:56Z'))).toBe('2026-07-12 18:34:56 SGT');
  });

  it('creates a child page using structured blocks', async () => {
    process.env.NOTION_API_KEY = 'test-secret';
    process.env.NOTION_PARENT_PAGE_ID = 'parent-page';
    const fetchMock = vi.fn().mockResolvedValue({ok: true, json: async () => ({url: 'https://notion.so/test-page'})});
    vi.stubGlobal('fetch', fetchMock);
    await expect(exportLearningToNotion('2026-07-12 18:34:56 SGT', [learning])).resolves.toBe('https://notion.so/test-page');
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(request.headers).toMatchObject({'Notion-Version': '2026-03-11'});
    expect(String(request.body)).toContain('Founder Learning — 2026-07-12 18:34:56 SGT');
    expect(String(request.body)).not.toContain('test-secret');
  });
});
