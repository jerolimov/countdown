import React, { useEffect, useState } from 'react';

export default function Countdown() {
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

  const countdown = Date.now() - start;

  const countdownString = (
    Math.floor(countdown / 1000 / 60 / 60) +
    ':' +
    Math.floor(countdown / 1000 / 60) +
    ':' +
    addPrefixZeros(Math.floor(countdown / 1000), 2) +
    '.' +
    addPrefixZeros(countdown % 1000, 3)
  );

  const fps = Math.round(frames / (Date.now() - start) * 1000);

  return (
    <div>
      {'Countdown: '}
      {countdownString}
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
