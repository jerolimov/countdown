import React from 'react';
import { render, fireEvent, screen, Matcher } from '@testing-library/react';

import App from './App';

describe('App', () => {

  //
  // Helper
  //
  const getInputElementByLabelText = (matcher: Matcher) => {
    const label = screen.getByLabelText(matcher);
    expect(label).toBeTruthy();
    expect(label.parentElement).toBeTruthy();
    expect(label.parentElement!.lastElementChild).toBeTruthy();
    return label.parentElement!.lastElementChild!;
  }

  it('renders', () => {
    render(<App />)

    screen.getByLabelText(/day/i);
    screen.getByLabelText(/hour/i);
    screen.getByLabelText(/minute/i);
    screen.getByLabelText(/second/i);

    const dayInput = getInputElementByLabelText(/day/i);
    const hourInput = getInputElementByLabelText(/hour/i);

    fireEvent.change(dayInput, { target: {value: '1'} });
    fireEvent.change(hourInput, { target: {value: '2'} });

  });
});
