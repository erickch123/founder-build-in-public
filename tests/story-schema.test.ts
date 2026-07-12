import {describe, expect, it} from 'vitest';
import {StoryPlanSchema} from '../src/domain/schemas.js';
import {loadDemoFixture} from '../src/fixtures/load-demo-fixture.js';
import {buildPublicManifest} from '../src/privacy/public-manifest.js';
import {planFixtureStory} from '../src/story/fixture-story-planner.js';

describe('story plan schema', () => {
  it('accepts the deterministic fixture planner output', async () => {
    const fixture = await loadDemoFixture();
    const manifest = buildPublicManifest({...fixture, userDisplay: 'Demo Founder'});
    expect(StoryPlanSchema.parse(planFixtureStory(manifest)).targetDurationSeconds).toBe(45);
  });

  it('rejects a duration that differs from its scenes', async () => {
    const fixture = await loadDemoFixture();
    const manifest = buildPublicManifest({...fixture, userDisplay: 'Demo Founder'});
    const story = planFixtureStory(manifest);
    expect(() => StoryPlanSchema.parse({...story, targetDurationSeconds: 55})).toThrow(/does not match/);
  });
});
