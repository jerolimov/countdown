import React, { useEffect, useState } from 'react';

import { getCountdownAsString } from '../utils/date';

export interface CountdownProps {
  paused: boolean,
  until: number;
}

export default function Countdown({ paused, until }: CountdownProps) {
  const [start] = useState(() => Date.now());
  const [frames, updateFrames] = useState<number>(0);

  // Endless re-rending loop (if not paused)
  useEffect(() => {
    const timer = !paused ? setInterval(() => {
      updateFrames(frame => frame + 1);
    }, 100) : null;
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [paused]);

  const restInMs = Date.now() - start - until;

  const countdownString = getCountdownAsString(restInMs);

  const fps = Math.round(frames / (Date.now() - start) * 1000);

  return (
    <div>
      <span>{'Countdown: '}</span>
      <span>{countdownString}</span>
      <br/>
      {'Frames: '}
      {frames}
      <br/>
      {'FPS: '}
      {fps}
    </div>
  );
}
