
export interface CounterState {
  isStarted: boolean;
  isPaused: boolean;
  laps: Array<{ duration: number }>;
}

export type CounterAction =
  | { type: 'START_PRESSED' }
  | { type: 'STOP_PRESSED' }
  | { type: 'PAUSE_PRESSED' }
  | { type: 'RESUME_PRESSED' }
  | { type: 'SPACE_PRESSED' }
  | { type: 'BACKSPACE_PRESSED' }

export const reducer = (prevState: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'START_PRESSED':
      return { ...prevState, isStarted: true, isPaused: false };
    case 'STOP_PRESSED':
      return { ...prevState, isStarted: false };
    case 'PAUSE_PRESSED':
      return { ...prevState, isStarted: true, isPaused: true };
    case 'RESUME_PRESSED':
      return { ...prevState, isStarted: true, isPaused: false };
    case 'SPACE_PRESSED':
      const duration = 3;
      return {
        ...prevState,
        laps: [ { duration }, ...prevState.laps ]
      };
    case 'BACKSPACE_PRESSED':
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
