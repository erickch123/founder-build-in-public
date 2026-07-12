import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import type {StoryPlan} from '../domain/schemas.js';

const here = dirname(fileURLToPath(import.meta.url));

export const renderFounderReel = async (story: StoryPlan, outputPath: string): Promise<void> => {
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
  const inputProps = {story};
  const composition = await selectComposition({serveUrl, id: 'FounderReel', inputProps});
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
  });
};
