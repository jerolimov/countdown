import React, { useEffect, useState } from 'react';

export interface CountdownProps {
  paused: boolean,
  until: number;
}

export default function Countdown({ until }: CountdownProps) {
  const [start] = useState(() => Date.now());
  const [frames, updateFrames] = useState<number>(0);

  useEffect(() => {
    /*
    const timer = setInterval(() => {
      updateFrames(frame => frame + 1);
    }, 500);
    return () => {
      clearInterval(timer);
    };
    */
  }, []);

  const countdownString = (
    Math.floor(until / 1000 / 60 / 60) +
    ':' +
    Math.floor(until / 1000 / 60) +
    ':' +
    addPrefixZeros(Math.floor(until / 1000), 2) +
    '.' +
    addPrefixZeros(until % 1000, 3)
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
