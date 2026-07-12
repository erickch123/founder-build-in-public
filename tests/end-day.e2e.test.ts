import {mkdtemp, readFile, stat, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {runEndDay} from '../src/pipeline/end-day.js';

describe('fixture-mode end-day', () => {
  it('creates every public artifact without confidential fixture content', async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), 'founder-e2e-'));
    const result = await runEndDay({
      userId: 'demo', workspaceId: 'default', fixture: true, storage: 'local', outputRoot,
      renderer: async (_story, outputPath) => writeFile(outputPath, 'fixture renderer contract'),
    });
    const publicFiles = ['public-manifest.json', 'story-plan.json', 'founder-digest.md', 'founder-digest.html', 'video-script.md', 'captions.srt'];
    const publicText = (await Promise.all(publicFiles.map((file) => readFile(join(result.outputDirectory, file), 'utf8')))).join('\n');
    expect(publicText).not.toContain('CONFIDENTIAL_CADT_ALPHA');
    expect((await stat(result.videoPath)).size).toBeGreaterThan(0);
    expect(result.durationSeconds).toBeGreaterThanOrEqual(45);
    expect(result.durationSeconds).toBeLessThanOrEqual(60);
  });
});
