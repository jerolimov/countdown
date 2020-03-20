
export interface CounterState {
  isStarted: boolean;
  isPaused: boolean;
  laps: Array<{ duration: number }>;
}

export type CounterAction =
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEW_LAP' }
  | { type: 'UNDO_NEW_LAP' }

export const reducer = (prevState: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'START':
      return { ...prevState, isStarted: true, isPaused: false };
    case 'STOP':
      return { ...prevState, isStarted: false };
    case 'PAUSE':
      return { ...prevState, isStarted: true, isPaused: true };
    case 'RESUME':
      return { ...prevState, isStarted: true, isPaused: false };
    case 'NEW_LAP':
      const duration = 3;
      return {
        ...prevState,
        laps: [ { duration }, ...prevState.laps ]
      };
    case 'UNDO_NEW_LAP':
      return { ...prevState, isStarted: true };
      default:
      console.warn('Unknown action:', action);
      return prevState;
  }
}

export const initialState: CounterState = {
  isStarted: false,
  isPaused: false,
  laps: [],
};
