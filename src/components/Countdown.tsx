import React, { useEffect, useState } from 'react';

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

  const countdownString = (
    Math.floor(restInMs / 1000 / 60 / 60) +
    ':' +
    Math.floor(restInMs / 1000 / 60) +
    ':' +
    addPrefixZeros(Math.floor(restInMs / 1000), 2) +
    '.' +
    addPrefixZeros(restInMs % 1000, 3)
  );

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

const addPrefixZeros = (x: number, length: number): string => {
  let result = x.toString();
  while (result.length < length) {
    result = '0' + result;
  }
  return result;
}
