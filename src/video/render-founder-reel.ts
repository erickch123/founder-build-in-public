import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import type {StoryPlan} from '../domain/schemas.js';
import {generateSystemNarration} from '../voice/system-narration.js';

const here = dirname(fileURLToPath(import.meta.url));

export interface FounderReelRenderResult {
  narrated: boolean;
  voiceProvider: 'macos-system' | 'none';
}

export const renderFounderReel = async (story: StoryPlan, outputPath: string): Promise<FounderReelRenderResult> => {
  const narrationTracks = await generateSystemNarration(story, dirname(outputPath));
  const serveUrl = await bundle({
    entryPoint: resolve(here, '../../remotion/index.tsx'),
    webpackOverride: (configuration) => ({
      ...configuration,
      resolve: {
        ...configuration.resolve,
        extensionAlias: {
          '.js': ['.ts', '.tsx', '.js'],
        },
      },
    }),
  });
  const inputProps = {story, narrationDataUrls: narrationTracks.map((track) => track.dataUrl)};
  const composition = await selectComposition({serveUrl, id: 'FounderReel', inputProps});
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
  });
  return {narrated: narrationTracks.length === story.scenes.length, voiceProvider: narrationTracks.length > 0 ? 'macos-system' : 'none'};
};
