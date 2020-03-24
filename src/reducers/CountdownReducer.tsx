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
      // Save new started at and until date.
      return {
        ...prevState,
        startedAt: action.at,
        pausedAt: null,
        restTimeInMs: action.countdownInMs,
        laps: [{
          startedAt: action.at,
          timeInMs: null,
          pausedInMs: 0,
        }],
      };
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
        const runnedPrevInMs = prevState.pausedAt.getTime() - prevState.startedAt.getTime();
        const pausedInMs = action.at.getTime() - prevState.pausedAt.getTime();
        let lastLap = prevState.laps[prevState.laps.length - 1];
        lastLap = {
          ...lastLap,
          pausedInMs: lastLap.pausedInMs + pausedInMs,
        }
        const laps = [...prevState.laps.slice(0, prevState.laps.length - 1), lastLap];
        return {
          ...prevState,
          startedAt: action.at,
          restTimeInMs: prevState.restTimeInMs - runnedPrevInMs,
          pausedAt: null,
          laps,
        };
      } else {
        return prevState;
      }
    }

    case 'STOPPED': {
      // Stopp only if countdown is running.. Re-tap stop to remove also the laps!
      if (prevState.startedAt) {
        return { ...prevState, startedAt: null, pausedAt: null };
      } else {
        return initialState;
      }
    }

    case 'NEW_LAP': {
      // Create a new lap (and prepend it)
      if (prevState.startedAt && !prevState.pausedAt) {
        let prevLap = prevState.laps[prevState.laps.length - 1];
        prevLap = {
          ...prevLap,
          timeInMs: action.at.getTime() - prevLap.startedAt.getTime(),
        };
        const newLap = {
          startedAt: action.at,
          timeInMs: null,
          pausedInMs: 0,
        };
        const laps = [...prevState.laps.slice(0, prevState.laps.length - 1), prevLap, newLap];
        return {
          ...prevState,
          laps,
        };
      } else {
        return prevState;
      }
    }

    case 'UNDO_NEW_LAP': {
      if (prevState.laps.length < 3) {
        return {
          ...prevState,
          laps: prevState.laps.slice(1)
        };
      } else {
        let currentLap = prevState.laps[prevState.laps.length - 1];
        let prev1 = prevState.laps[prevState.laps.length - 2];
        let prev2 = prevState.laps[prevState.laps.length - 3];
        const newLap = {
          startedAt: prev2.startedAt,
          timeInMs: prev1.timeInMs! + prev2.timeInMs!,
          pausedInMs: prev1.pausedInMs + prev2.pausedInMs,
        };
        const laps = [
          ...prevState.laps.slice(0, prevState.laps.length - 3),
          newLap,
          currentLap,
        ];
        return {
          ...prevState,
          laps,
        };
      }
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
