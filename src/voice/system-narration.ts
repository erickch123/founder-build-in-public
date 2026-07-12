import {execFile} from 'node:child_process';
import {mkdir, readFile, unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
import {promisify} from 'node:util';
import type {StoryPlan} from '../domain/schemas.js';

const execFileAsync = promisify(execFile);

export interface NarrationTrack {
  path: string;
  dataUrl: string;
}

export const speechRateForScene = (narration: string, durationSeconds: number): number => {
  const words = narration.trim().split(/\s+/).length;
  const usableSeconds = Math.max(1, durationSeconds - 0.75);
  return Math.min(210, Math.max(155, Math.ceil((words / usableSeconds) * 60)));
};

export const generateSystemNarration = async (story: StoryPlan, outputDirectory: string): Promise<NarrationTrack[]> => {
  if (process.platform !== 'darwin') return [];
  const narrationDirectory = resolve(outputDirectory, 'narration');
  await mkdir(narrationDirectory, {recursive: true});

  return Promise.all(story.scenes.map(async (scene, index) => {
    const stem = `scene-${String(index + 1).padStart(2, '0')}`;
    const aiffPath = resolve(narrationDirectory, `${stem}.aiff`);
    const m4aPath = resolve(narrationDirectory, `${stem}.m4a`);
    const rate = speechRateForScene(scene.narration, scene.durationSeconds);
    await execFileAsync('say', ['-r', String(rate), '-o', aiffPath, scene.narration]);
    await execFileAsync('ffmpeg', ['-loglevel', 'error', '-y', '-i', aiffPath, '-c:a', 'aac', '-b:a', '160k', m4aPath]);
    await unlink(aiffPath);
    const audio = await readFile(m4aPath);
    return {path: m4aPath, dataUrl: `data:audio/mp4;base64,${audio.toString('base64')}`};
  }));
};
