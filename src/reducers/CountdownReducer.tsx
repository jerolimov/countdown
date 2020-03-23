import { CounterState, Time } from "../types";

export type CounterAction =
  | { type: 'SET_COUNTDOWN', countdown: Time }
  | { type: 'ADD_THRESHOLD' }
  | { type: 'UPDATE_THRESHOLD', index: number, threshold: Time }
  | { type: 'REMOVE_THRESHOLD', index: number }
  | { type: 'STARTED', at: Date, countdownInMs: number }
  | { type: 'STOPPED', at: Date }
  | { type: 'PAUSED', at: Date }
  | { type: 'RESUMED', at: Date }
  | { type: 'NEW_LAP', at: Date }
  | { type: 'UNDO_NEW_LAP' }

export const reducer = (prevState: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'SET_COUNTDOWN': {
      return { ...prevState, countdown: action.countdown }
    }

    case 'ADD_THRESHOLD': {
      const thresholds = [
        ...prevState.thresholds,
        { days: 0, hours: 0, seconds: 0, minutes: 0 },
      ];
      return { ...prevState, thresholds };
    }

    case 'UPDATE_THRESHOLD': {
      const thresholds = [
        ...prevState.thresholds.slice(0, action.index),
        action.threshold,
        ...prevState.thresholds.slice(action.index + 1),
      ];
      return { ...prevState, thresholds };
    }

    case 'REMOVE_THRESHOLD': {
      const thresholds = prevState.thresholds.filter((_, index) => index !== action.index);
      return { ...prevState, thresholds }
    }

    case 'STARTED': {
      // Save new started at and until date. Reset laps?!
      return {
        ...prevState,
        startedAt: action.at,
        pausedAt: null,
        restTimeInMs: action.countdownInMs,
      };
    }

    case 'STOPPED': {
      // Stopp only if countdown is running.. Re-tap stop to remove also the laps!
      if (prevState.startedAt) {
        return { ...prevState, startedAt: null, pausedAt: null };
      } else {
        return initialState;
      }
    }

    case 'PAUSED': {
      // Pause only if countdown is running...
      if (prevState.startedAt && !prevState.pausedAt) {
        return { ...prevState, pausedAt: action.at };
      } else {
        return prevState;
      }
    }

    case 'RESUMED': {
      // Resume only if countdown is paused...
      if (prevState.startedAt && prevState.pausedAt) {
        const resumedAfterInMs = action.at.getTime() - prevState.pausedAt.getTime();
        const restTimeInMs = prevState.restTimeInMs - resumedAfterInMs
        return { ...prevState, pausedAt: null, restTimeInMs };
      } else {
        return prevState;
      }
    }

    case 'NEW_LAP': {
      // Create a new lap (and prepend it)
      if (prevState.startedAt) {
        const from = prevState.laps[0]?.at || prevState.pausedAt || prevState.startedAt;
        const until = action.at;
        const timeInMs = until.getTime() - from.getTime();
        return { ...prevState, laps: [ { at: action.at, timeInMs }, ...prevState.laps ] };
      } else {
        return prevState;
      }
    }

    case 'UNDO_NEW_LAP': {
      // Remove newest lap (first in list)
      return {
        ...prevState,
        laps: prevState.laps.slice(1),
      };
    }

    default: {
      console.warn('Unknown action:', action);
      return prevState;
    }
  }
}

export const initialState: CounterState = {
  countdown: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  thresholds: [],

  startedAt: null,
  pausedAt: null,
  restTimeInMs: 0,
  laps: [],
};
