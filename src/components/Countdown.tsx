import React, { useEffect, useState } from 'react';

import { getTimeWithoutMilliseconds, getTimeMilliseconds } from '../utils/date';

export interface CountdownProps {
  startedAt: Date,
  pausedAt: Date | null,
  restTimeInMs: number,
}

export default function Countdown({ startedAt, pausedAt, restTimeInMs }: CountdownProps) {
  return (
    <pre style={{ textAlign: 'center', fontSize: 24 }}>
      <CountdownTimeWithoutMilliseconds startedAt={startedAt} pausedAt={pausedAt} restTimeInMs={restTimeInMs} />
      {'.'}
      <CountdownTimeJustMilliseconds startedAt={startedAt} pausedAt={pausedAt} restTimeInMs={restTimeInMs} />
    </pre>
  );
}

function CountdownTimeWithoutMilliseconds({ startedAt, pausedAt, restTimeInMs }: CountdownProps) {
  const nowInMs = pausedAt?.getTime() ?? Date.now();
  const untilInMs = startedAt.getTime() - nowInMs + restTimeInMs;
  const [, updateFrames] = useState<number>(0);

  // Endless re-rending loop (if not paused)
  useEffect(() => {
    const timer = !pausedAt ? setInterval(() => {
      updateFrames(frame => frame + 1);
    }, 200) : null;
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [pausedAt]);

  return <>{getTimeWithoutMilliseconds(untilInMs)}</>
}

function CountdownTimeJustMilliseconds({ startedAt, pausedAt, restTimeInMs }: CountdownProps) {
  const nowInMs = pausedAt?.getTime() ?? Date.now();
  const untilInMs = startedAt.getTime() - nowInMs + restTimeInMs;
  const [, updateFrames] = useState<number>(0);

  // Endless re-rending loop (if not paused)
  useEffect(() => {
    const timer = !pausedAt ? setInterval(() => {
      updateFrames(frame => frame + 1);
    }, 16) : null;
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [pausedAt]);

  return <>{getTimeMilliseconds(untilInMs)}</>
}
