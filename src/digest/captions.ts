import type {StoryPlan} from '../domain/schemas.js';

const timestamp = (seconds: number): string => {
  const millis = Math.round(seconds * 1000);
  const hours = Math.floor(millis / 3_600_000);
  const minutes = Math.floor((millis % 3_600_000) / 60_000);
  const secs = Math.floor((millis % 60_000) / 1000);
  const ms = millis % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
};

export const compileSrt = (story: StoryPlan): string => {
  let cursor = 0;
  return story.scenes.map((scene, index) => {
    const start = cursor;
    cursor += scene.durationSeconds;
    return `${index + 1}\n${timestamp(start)} --> ${timestamp(cursor)}\n${scene.narration}\n`;
  }).join('\n');
};
