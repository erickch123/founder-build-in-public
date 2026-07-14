import {mkdtemp, readFile, stat, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {runEndDay} from '../src/pipeline/end-day.js';
import {createManualReflection} from '../src/reflections/manual-reflections.js';
import {createManualCapture} from '../src/captures/manual-captures.js';

describe('fixture-mode end-day', () => {
  it('creates every public artifact without confidential fixture content', async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), 'founder-e2e-'));
    const result = await runEndDay({
      userId: 'demo', workspaceId: 'default', fixture: true, storage: 'local', outputRoot,
      manualCaptures: [createManualCapture({
        userId: 'demo', workspaceId: 'employment', text: 'CONFIDENTIAL_MANUAL_EMPLOYMENT',
        publicRequested: false,
      }, new Date('2026-07-14T02:00:00Z'))],
      renderer: async (_story, outputPath) => writeFile(outputPath, 'fixture renderer contract'),
    });
    const publicFiles = ['public-manifest.json', 'story-plan.json', 'founder-digest.md', 'founder-digest.html', 'video-script.md', 'captions.srt'];
    const publicText = (await Promise.all(publicFiles.map((file) => readFile(join(result.outputDirectory, file), 'utf8')))).join('\n');
    expect(publicText).not.toContain('CONFIDENTIAL_CADT_ALPHA');
    expect(publicText).not.toContain('CONFIDENTIAL_MANUAL_EMPLOYMENT');
    expect((await stat(result.videoPath)).size).toBeGreaterThan(0);
    expect(result.durationSeconds).toBeGreaterThanOrEqual(45);
    expect(result.durationSeconds).toBeLessThanOrEqual(60);
  });

  it('includes an explicitly public manual reflection in generated artifacts', async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), 'founder-reflection-e2e-'));
    const reflection = createManualReflection({
      topic: 'Hackathon pacing',
      text: 'Protect time for recording before the submission deadline.',
      whyItMatters: 'A finished demo still needs a clear story.',
      publicSafe: true,
    }, new Date('2026-07-12T10:00:00Z'));
    const result = await runEndDay({
      userId: 'demo', workspaceId: 'default', fixture: true, storage: 'local', outputRoot,
      manualReflections: [reflection],
      renderer: async (_story, outputPath) => writeFile(outputPath, 'fixture renderer contract'),
    });

    const manifest = await readFile(join(result.outputDirectory, 'public-manifest.json'), 'utf8');
    expect(manifest).toContain('Protect time for recording before the submission deadline.');
  });
});
