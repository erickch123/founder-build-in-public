import React from 'react';
import {Composition} from 'remotion';
import type {StoryPlan} from '../src/domain/schemas.js';
import {FounderReel} from './video.js';

const placeholder: StoryPlan = {
  title: 'Founder Build in Public',
  theme: 'Building creates the story',
  hook: 'The work already contains the story.',
  founderLesson: 'Keep building.',
  nextStep: 'Ship.',
  targetDurationSeconds: 56,
  voiceover: 'The work already contains the story.',
  scenes: [
    {id: 'placeholder', type: 'hook', durationSeconds: 56, headline: 'Founder Build in Public', body: 'Building creates the story.', narration: 'The work already contains the story.', evidenceIds: [], accent: '#FFCC66'},
  ],
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="FounderReel"
    component={FounderReel}
    durationInFrames={56 * 30}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{story: placeholder}}
  />
);
