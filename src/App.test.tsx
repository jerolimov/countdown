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

    expect(screen.getAllByLabelText(/day/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/hour/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/minute/i)).toHaveLength(2);
    expect(screen.getAllByLabelText(/second/i)).toHaveLength(2);

    const dayInput = getFirstInputElementByLabelText(/day/i);
    const hourInput = getFirstInputElementByLabelText(/hour/i);

    fireEvent.change(dayInput, { target: {value: '1'} });
    fireEvent.change(hourInput, { target: {value: '2'} });
  });

  it('restores state correctly', () => {
    render(<App />)

    expect(getItem).toHaveBeenCalledWith('countdown_state');

    fireEvent.click(screen.getByText('Start'), {});

    expect(setItem).toHaveBeenCalledWith('countdown_state', expect.any(String));

  });
});
