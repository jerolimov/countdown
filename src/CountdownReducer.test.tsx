import { reducer, initialState } from './CountdownReducer';

describe('reducer', () => {

  it('should switch to started after START was received', () => {
    expect(reducer(initialState, { type: 'START_PRESSED' })).toEqual({
      isStarted: true,
      isPaused: false,
      laps: [],
    });
  });

  it('should switch to not started after STOP was received', () => {
    expect(reducer(initialState, { type: 'STOP_PRESSED' })).toEqual({
      isStarted: false,
      isPaused: false,
      laps: [],
    });
  });

  it('should switch to paused after PAUSED was received', () => {
    expect(reducer(initialState, { type: 'PAUSE_PRESSED' })).toEqual({
      isStarted: true,
      isPaused: true,
      laps: [],
    });
  });

  it('should switch to not paused after RESUMED was received', () => {
    expect(reducer(initialState, { type: 'RESUME_PRESSED' })).toEqual({
      isStarted: true,
      isPaused: false,
      laps: [],
    });
  });

});
