import { CounterState } from "../types";
import { initialState } from "../reducers/CountdownReducer";

export function parseCounterState(state: string): CounterState {
  try {
    const restoredState = JSON.parse(state);
    return {
      countdown: restoredState?.countdown ?? { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: restoredState?.thresholds ?? [],
      startedAt: restoredState?.startedAt ? new Date(restoredState?.startedAt) : null,
      pausedAt: restoredState?.pausedAt ? new Date(restoredState?.pausedAt) : null,
      restTimeInMs: restoredState?.restTimeInMs ?? null,
      laps: restoredState?.laps?.map((lap: any) => ({
        ...lap,
        startedAt: new Date(lap.startedAt),
      })) ?? [],
    };
  } catch (error) {
    console.warn('error', error);
    return initialState;
  }
}

export function stringifyCounterState(state: CounterState): string {
  return JSON.stringify(state);
}
