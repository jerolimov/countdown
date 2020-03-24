import { reducer, initialState, CounterAction } from './CountdownReducer';
import { CounterState } from '../types';

describe('reducer', () => {

  it('should switch to STARTED after STARTED was received', () => {
    const action: CounterAction = {
      type: 'STARTED',
      at: new Date('2020-03-22 14:00:30'),
      countdownInMs: 30000,
    }
    const expectedState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should switch from STARTED to STOPPED after STOPPED was received', () => {
    const prevState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    const action: CounterAction = {
      type: 'STOPPED',
      at: new Date('2020-03-22 14:30:45'),
    }
    const expectedState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: null,
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

  it('should switch from STARTED to PAUSED after PAUSED was received', () => {
    const prevState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    const action: CounterAction = {
      type: 'PAUSED',
      at: new Date('2020-03-22 14:30:45'),
    }
    const expectedState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: new Date('2020-03-22 14:30:45'),
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

  it('should switch from PAUSED to STARTED after RESUMED was received', () => {
    const prevState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: new Date('2020-03-22 14:00:32'),
      restTimeInMs: 30 * 1000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    const action: CounterAction = {
      type: 'RESUMED',
      at: new Date('2020-03-22 14:00:35'),
    }
    const expectedState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:35'),
      pausedAt: null,
      restTimeInMs: 28 * 1000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: null, pausedInMs: 3000 },
      ],
    }
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

  it('should create a new lap when NEW_LAP was received', () => {
    const prevState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    const action: CounterAction = {
      type: 'NEW_LAP',
      at: new Date('2020-03-22 14:00:35'),
    }
    const expectedState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: 5000, pausedInMs: 0 },
        { startedAt: new Date('2020-03-22 14:00:35'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

  it('should create another new lap when NEW_LAP was received', () => {
    const prevState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: 2000, pausedInMs: 0 },
        { startedAt: new Date('2020-03-22 14:00:32'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    const action: CounterAction = {
      type: 'NEW_LAP',
      at: new Date('2020-03-22 14:00:35'),
    }
    const expectedState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:00:30'), timeInMs: 2000, pausedInMs: 0 },
        { startedAt: new Date('2020-03-22 14:00:32'), timeInMs: 3000, pausedInMs: 0 },
        { startedAt: new Date('2020-03-22 14:00:35'), timeInMs: null, pausedInMs: 0 },
      ],
    }
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

  it('should remove a lap when UNDO_NEW_LAP was received', () => {
    const prevState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:30:45'), timeInMs: 30000, pausedInMs: 0 },
      ],
    }
    const action: CounterAction = {
      type: 'UNDO_NEW_LAP',
    }
    const expectedState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [],
    }
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

  it('should remove a second lap when UNDO_NEW_LAP was received', () => {
    const prevState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:31:45'), timeInMs: 30000, pausedInMs: 0 },
        { startedAt: new Date('2020-03-22 14:30:45'), timeInMs: 30000, pausedInMs: 0 },
      ],
    }
    const action: CounterAction = {
      type: 'UNDO_NEW_LAP',
    }
    const expectedState: CounterState = {
      countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      thresholds: [],
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 14:30:45'), timeInMs: 30000, pausedInMs: 0 },
      ],
    }
    expect(reducer(prevState, action)).toEqual(expectedState);
  });

});
