import React from 'react';
import { render, fireEvent, screen, Matcher } from '@testing-library/react';

import App from './App';

describe('App', () => {

  let keyValues: Record<string, string>;
  let getItem: jest.Mock;
  let setItem: jest.Mock;

  beforeEach(() => {
    keyValues = {};
    localStorage.__proto__.getItem = getItem = jest.fn();
    localStorage.__proto__.setItem = setItem = jest.fn();
    getItem.mockImplementation((name: string) => {
      // console.log('getItem', name);
      return keyValues[name];
    });
    setItem.mockImplementation((name: string, value: string) => {
      // console.log('setItem', name, value);
      keyValues[name] = value;
    });
  });
  
  //
  // Helper
  //
  const getFirstInputElementByLabelText = (matcher: Matcher) => {
    const label = screen.getAllByLabelText(matcher)[0];
    expect(label).toBeTruthy();
    expect(label.parentElement).toBeTruthy();
    expect(label.parentElement!.lastElementChild).toBeTruthy();
    return label.parentElement!.lastElementChild!;
  }

  it('renders', () => {
    render(<App />)

    expect(screen.getAllByLabelText(/day/i)).toHaveLength(1);
    expect(screen.getAllByLabelText(/hour/i)).toHaveLength(1);
    expect(screen.getAllByLabelText(/minute/i)).toHaveLength(1);
    expect(screen.getAllByLabelText(/second/i)).toHaveLength(1);

    const dayInput = getFirstInputElementByLabelText(/day/i);
    const hourInput = getFirstInputElementByLabelText(/hour/i);

    fireEvent.change(dayInput, { target: {value: '1'} });
    fireEvent.change(hourInput, { target: {value: '2'} });
  });

  it('restores null-state correctly', () => {
    render(<App />)

    expect(getItem).toHaveBeenCalledWith('countdown_state_v2');

    fireEvent.click(screen.getByText('Start'), {});

    expect(setItem).toHaveBeenCalledWith('countdown_state_v2', expect.any(String));

  });

  it('restores real state, started without laps', () => {
    getItem.mockReturnValueOnce(JSON.stringify({
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { startedAt: new Date('2020-03-22 15:00:00'), timeInMs: null, pausedInMs: 0 },
      ],
    }))

    render(<App />)

    screen.getByText('Pause');
    expect(screen.queryByText('Resume')).toBeFalsy();
    screen.getByText('New lap');
    expect(screen.getByText('Undo new lap').getAttribute('disabled')).toBe("");
    screen.getByText('Stop');

    expect(setItem).toHaveBeenCalledWith('countdown_state_v2', expect.any(String));

  });

  it('restores real state, paused with laps', () => {
    getItem.mockReturnValueOnce(JSON.stringify({
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: new Date('2020-03-22 14:00:50'),
      restTimeInMs: 30000,
      laps: [
        { at: new Date('2020-03-22 14:00:55'), timeInMs: 10000 },
        { at: new Date('2020-03-22 14:00:45'), timeInMs: 15000 },
      ],
    }))

    render(<App />)

    expect(screen.queryByText('Pause')).toBeFalsy();
    screen.getByText('Resume');
    screen.getByText('New lap');
    expect(screen.getByText('Undo new lap').getAttribute('disabled')).toBe(null);
    screen.getByText('Stop');

    expect(setItem).toHaveBeenCalledWith('countdown_state_v2', expect.any(String));

  });

  it('restores real state, stop countdown', () => {
    getItem.mockReturnValueOnce(JSON.stringify({
      startedAt: new Date('2020-03-22 14:00:30'),
      pausedAt: null,
      restTimeInMs: 30000,
      laps: [
        { at: new Date('2020-03-22 14:00:55'), timeInMs: 10000 },
        { at: new Date('2020-03-22 14:00:45'), timeInMs: 15000 },
      ],
    }))

    render(<App />)

    fireEvent.click(screen.getByText('Stop'), {});
    fireEvent.click(screen.getByText('Confirm'), {});

    expect(screen.queryByText('Stop')).toBeFalsy();
    screen.getByText('Start');

    expect(setItem).toHaveBeenCalledWith('countdown_state_v2', expect.any(String));

  });
});
