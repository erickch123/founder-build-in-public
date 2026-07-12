import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {StoryPlan} from '../src/domain/schemas.js';

const Scene: React.FC<{scene: StoryPlan['scenes'][number]; index: number; narrationDataUrl: string | undefined}> = ({scene, index, narrationDataUrl}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const fade = interpolate(frame, [0, 10, scene.durationSeconds * fps - 10, scene.durationSeconds * fps], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease)});
  const y = interpolate(enter, [0, 1], [90, 0]);

  return (
    <AbsoluteFill style={{background: '#090D18', color: '#F8F5EA', fontFamily: 'Inter, ui-sans-serif, system-ui', padding: '150px 90px 130px', opacity: fade, overflow: 'hidden'}}>
      {narrationDataUrl && <Audio src={narrationDataUrl} volume={0.95} />}
      <div style={{position: 'absolute', inset: '-20% -50%', background: `radial-gradient(circle at 50% 45%, ${scene.accent}30, transparent 42%)`, transform: `scale(${1 + frame / (fps * 100)})`}} />
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: scene.accent, fontSize: 28, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase'}}>
        <span>Founder Build in Public</span><span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div style={{position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', transform: `translateY(${y}px)`}}>
        {scene.type === 'terminal' && <div style={{background: '#111827', border: '1px solid #334155', borderRadius: 24, padding: '24px 28px', marginBottom: 48, color: '#7FDBCA', fontFamily: 'ui-monospace, monospace', fontSize: 28}}>● ● ●&nbsp;&nbsp; founder — fixture mode</div>}
        <h1 style={{fontSize: scene.type === 'terminal' ? 68 : 92, lineHeight: 1.02, letterSpacing: -4, margin: 0, maxWidth: 900}}>{scene.headline}</h1>
        <div style={{width: 130, height: 10, borderRadius: 10, background: scene.accent, margin: '52px 0'}} />
        {scene.type === 'highlights' ? (
          <div style={{display: 'grid', gap: 24}}>
            {scene.body.split('\n\n').map((section) => {
              const [label, detail] = section.split('\n');
              return <div key={label} style={{background: '#111827CC', border: `1px solid ${scene.accent}66`, borderRadius: 24, padding: '28px 32px'}}><div style={{color: scene.accent, fontSize: 25, fontWeight: 800, letterSpacing: 3, marginBottom: 14}}>{label}</div><div style={{fontSize: 34, lineHeight: 1.3, color: '#E8EDF7'}}>{detail}</div></div>;
            })}
          </div>
        ) : (
          <p style={{fontSize: 43, lineHeight: 1.3, margin: 0, color: '#C9D3E6', maxWidth: 880, whiteSpace: 'pre-line'}}>{scene.body}</p>
        )}
      </div>
      <div style={{position: 'relative', background: '#F8F5EA', color: '#101522', borderRadius: 24, padding: '30px 36px', fontSize: 35, lineHeight: 1.3, fontWeight: 650, boxShadow: `0 18px 60px ${scene.accent}22`}}>{scene.narration}</div>
    </AbsoluteFill>
  );
};

export const FounderReel: React.FC<{story: StoryPlan; narrationDataUrls: string[]}> = ({story, narrationDataUrls}) => {
  let start = 0;
  return (
    <AbsoluteFill style={{background: '#090D18'}}>
      {story.scenes.map((scene, index) => {
        const from = start;
        const duration = scene.durationSeconds * 30;
        start += duration;
        return <Sequence key={scene.id} from={from} durationInFrames={duration}><Scene scene={scene} index={index} narrationDataUrl={narrationDataUrls[index]} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
