import React, { useEffect, useState } from 'react';

import { getCountdownAsString } from '../utils/date';

export interface CountdownProps {
  startedAt: Date,
  paused: boolean,
  restTimeInMs: number,
}

export default function Countdown({ startedAt, paused, restTimeInMs }: CountdownProps) {
  const [_, updateFrames] = useState<number>(0);

  // Endless re-rending loop (if not paused)
  useEffect(() => {
    const timer = !paused ? setInterval(() => {
      updateFrames(frame => frame + 1);
    }, 16) : null;
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [paused]);

  const untilInMs = startedAt.getTime() - Date.now() + restTimeInMs;
  const countdownString = getCountdownAsString(untilInMs);

  return (
    <div style={{ textAlign: 'center' }}>
      {/*
      <p>
        startedAt: {startedAt?.toISOString()}
      </p>
      <p>
        untilInMs: {untilInMs}
      </p>
      <p>
        paused: {paused ? 'true' : 'false'}
      </p>
      */}
      <strong>Countdown:</strong><br/>
      <pre style={{ fontSize: 24 }}>{countdownString}</pre>
    </div>
  );
}
