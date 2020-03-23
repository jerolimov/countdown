import React, { useEffect, useState } from 'react';

import { getTimeWithMilliseconds, getTimeWithoutMilliseconds, getTimeMilliseconds } from '../utils/date';

export interface CountdownProps {
  startedAt: Date,
  paused: boolean,
  restTimeInMs: number,
}

export default function Countdown({ startedAt, paused, restTimeInMs }: CountdownProps) {
  return (
    <pre style={{ textAlign: 'center', fontSize: 24 }}>
      <CountdownTimeWithoutMilliseconds startedAt={startedAt} paused={paused} restTimeInMs={restTimeInMs} />
      {'.'}
      <CountdownTimeJustMilliseconds startedAt={startedAt} paused={paused} restTimeInMs={restTimeInMs} />
    </pre>
  );
}

function CountdownTimeWithoutMilliseconds({ startedAt, paused, restTimeInMs }: CountdownProps) {
  const untilInMs = startedAt.getTime() - Date.now() + restTimeInMs;
  const [, updateFrames] = useState<number>(0);

  // Endless re-rending loop (if not paused)
  useEffect(() => {
    const timer = !paused ? setInterval(() => {
      updateFrames(frame => frame + 1);
    }, 200) : null;
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [paused]);

  return <>{getTimeWithoutMilliseconds(untilInMs)}</>
}

function CountdownTimeJustMilliseconds({ startedAt, paused, restTimeInMs }: CountdownProps) {
  const untilInMs = startedAt.getTime() - Date.now() + restTimeInMs;
  const [, updateFrames] = useState<number>(0);

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

  return <>{getTimeMilliseconds(untilInMs)}</>
}
