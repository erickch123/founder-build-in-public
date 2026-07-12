import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {StoryPlanSchema} from '../domain/schemas.js';
import {compileSrt} from '../digest/captions.js';
import {compileDigestHtml, compileDigestMarkdown} from '../digest/compile-digest.js';
import {loadDemoFixture} from '../fixtures/load-demo-fixture.js';
import {buildPublicManifest} from '../privacy/public-manifest.js';
import {planFixtureStory} from '../story/fixture-story-planner.js';
import {renderFounderReel} from '../video/render-founder-reel.js';
import type {FounderReelRenderResult} from '../video/render-founder-reel.js';

type VideoRenderer = (story: ReturnType<typeof StoryPlanSchema.parse>, outputPath: string) => Promise<FounderReelRenderResult | void>;

export interface EndDayOptions {
  userId: string;
  workspaceId: string;
  fixture: boolean;
  storage: 'local';
  outputRoot?: string;
  renderer?: VideoRenderer;
}

export interface EndDayResult {
  outputDirectory: string;
  digestPath: string;
  videoPath: string;
  storyTitle: string;
  durationSeconds: number;
  excludedConfidentialEvents: number;
  narrated: boolean;
  voiceProvider: string;
}

const writeJson = async (path: string, value: unknown): Promise<void> =>
  writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

export const runEndDay = async (options: EndDayOptions): Promise<EndDayResult> => {
  if (!options.fixture) {
    throw new Error('Live mode is not implemented yet. Run with --fixture.');
  }
  if (options.workspaceId !== 'default') {
    throw new Error('end-day currently runs only in the default aggregate workspace.');
  }

  const startedAt = new Date().toISOString();
  const fixture = await loadDemoFixture();
  const outputDirectory = resolve(options.outputRoot ?? 'outputs', fixture.date);
  await mkdir(outputDirectory, {recursive: true});

  const manifest = buildPublicManifest({
    date: fixture.date,
    userDisplay: options.userId === 'demo' ? 'Demo Founder' : options.userId,
    events: fixture.events,
    learnings: fixture.learnings,
    sources: fixture.sources,
    workspaces: fixture.workspaces,
  });
  const story = planFixtureStory(manifest);
  const digestMarkdown = compileDigestMarkdown(manifest, story);
  const digestHtml = compileDigestHtml(manifest, story);
  const videoPath = resolve(outputDirectory, 'founder-reel.mp4');

  await Promise.all([
    writeJson(resolve(outputDirectory, 'learning-log.json'), fixture.learnings),
    writeJson(resolve(outputDirectory, 'public-manifest.json'), manifest),
    writeJson(resolve(outputDirectory, 'story-plan.json'), story),
    writeFile(resolve(outputDirectory, 'founder-digest.md'), digestMarkdown, 'utf8'),
    writeFile(resolve(outputDirectory, 'founder-digest.html'), digestHtml, 'utf8'),
    writeFile(resolve(outputDirectory, 'video-script.md'), `# Video script\n\n${story.scenes.map((scene) => `## ${scene.headline}\n\n${scene.narration}`).join('\n\n')}\n`, 'utf8'),
    writeFile(resolve(outputDirectory, 'captions.srt'), compileSrt(story), 'utf8'),
  ]);

  const renderResult = await (options.renderer ?? renderFounderReel)(story, videoPath);

  const excludedConfidentialEvents = fixture.events.filter((event) => event.visibility === 'confidential').length;
  await writeJson(resolve(outputDirectory, 'run-manifest.json'), {
    runId: `fixture-${fixture.date}-${Date.now()}`,
    startedAt,
    finishedAt: new Date().toISOString(),
    mode: 'fixture',
    userId: options.userId,
    workspaceId: options.workspaceId,
    sourceCount: fixture.sources.length,
    selectedSourceCount: fixture.sources.filter((source) => source.selected).length,
    excludedConfidentialEvents,
    modelProvider: 'deterministic-fixture',
    stagesCompleted: ['collect', 'normalize', 'curate', 'extract', 'classify', 'privacy-filter', 'plan-story', 'compile-digest', 'render-video'],
    artifacts: ['learning-log.json', 'public-manifest.json', 'story-plan.json', 'founder-digest.md', 'founder-digest.html', 'video-script.md', 'captions.srt', 'founder-reel.mp4'],
    voiceProvider: renderResult?.voiceProvider ?? 'test-renderer',
    warnings: renderResult && !renderResult.narrated ? ['System narration was unavailable; the reel is caption-led.'] : [],
  });

  return {
    outputDirectory,
    digestPath: resolve(outputDirectory, 'founder-digest.html'),
    videoPath,
    storyTitle: story.title,
    durationSeconds: story.targetDurationSeconds,
    excludedConfidentialEvents,
    narrated: renderResult?.narrated ?? false,
    voiceProvider: renderResult?.voiceProvider ?? 'test-renderer',
  };
};
