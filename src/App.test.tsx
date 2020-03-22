import React from 'react';
import { render, fireEvent, screen, Matcher } from '@testing-library/react';

import App from './App';

describe('App', () => {

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
});
