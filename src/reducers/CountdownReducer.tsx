import { Lap } from "../types";

export interface CounterState {
  startedAt: Date | null;
  pausedAt: Date | null;
  restTimeInMs: number,
  laps: Array<Lap>;
}

export type CounterAction =
  | { type: 'STARTED', at: Date, countdownInMs: number }
  | { type: 'STOPPED', at: Date }
  | { type: 'PAUSED', at: Date }
  | { type: 'RESUMED', at: Date }
  | { type: 'NEW_LAP', at: Date }
  | { type: 'UNDO_NEW_LAP' }

export const reducer = (prevState: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'STARTED':
      // Save new started at and until date. Reset laps?!
      return { startedAt: action.at, pausedAt: null, restTimeInMs: action.countdownInMs, laps: [] };
    case 'STOPPED':
      // Stopp only if countdown is running.. Re-tap stop to remove also the laps!
      if (prevState.startedAt) {
        return { ...prevState, startedAt: null, pausedAt: null };
      } else {
        return initialState;
      }
    case 'PAUSED':
      // Pause only if countdown is running...
      if (prevState.startedAt && !prevState.pausedAt) {
        return { ...prevState, pausedAt: action.at };
      } else {
        return prevState;
      }
    case 'RESUMED':
      // Resume only if countdown is paused...
      if (prevState.startedAt && prevState.pausedAt) {
        const resumedAfterInMs = action.at.getTime() - prevState.pausedAt.getTime();
        const restTimeInMs = prevState.restTimeInMs - resumedAfterInMs
        return { ...prevState, pausedAt: null, restTimeInMs };
      } else {
        return prevState;
      }
    case 'NEW_LAP':
      // Create a new lap (and prepend it)
      if (prevState.startedAt) {
        const from = prevState.laps[0]?.at || prevState.pausedAt || prevState.startedAt;
        const until = action.at;
        const timeInMs = until.getTime() - from.getTime();
        return { ...prevState, laps: [ { at: action.at, timeInMs }, ...prevState.laps ] };
      } else {
        return prevState;
      }
    case 'UNDO_NEW_LAP':
      // Remove newest lap (first in list)
      return { ...prevState, laps: prevState.laps.slice(1) };
    default:
      console.warn('Unknown action:', action);
      return prevState;
  }
}

export const initialState: CounterState = {
  startedAt: null,
  pausedAt: null,
  restTimeInMs: 0,
  laps: [],
};
