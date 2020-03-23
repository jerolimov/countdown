import React from 'react';
import { render, fireEvent, screen, Matcher } from '@testing-library/react';

import TimeInput from './TimeInput';
import { Time } from '../types';

describe('TimeInput', () => {

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

  const getInputElementValueByLabelText = (matcher: Matcher) => {
    return getInputElementByLabelText(matcher).getAttribute('value')
  }

  const assertTimeOutput = (time: Time) => {
    expect(getInputElementValueByLabelText(/day/i)).toBe(time.days.toString());
    expect(getInputElementValueByLabelText(/hour/i)).toBe(time.hours.toString());
    expect(getInputElementValueByLabelText(/minute/i)).toBe(time.minutes.toString());
    expect(getInputElementValueByLabelText(/second/i)).toBe(time.seconds.toString());
  }

  //
  // Output tests
  //
  it('should render four labeled input fields', () => {
    render(<TimeInput />);

    // Assert labels
    screen.getByLabelText(/day/i);
    screen.getByLabelText(/hour/i);
    screen.getByLabelText(/minute/i);
    screen.getByLabelText(/second/i);

    // Assert number of input fields
    expect(screen.queryAllByDisplayValue(/0/)).toHaveLength(4);
  });

  it('should render the controlled value', () => {
    const time: Time = {
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    }
    const onChange = jest.fn();
    render(<TimeInput value={time} onChange={onChange} />);

    // Assert labels
    screen.getByLabelText(/day/i);
    screen.getByLabelText(/hour/i);
    screen.getByLabelText(/minute/i);
    screen.getByLabelText(/second/i);

    // Assert that the right input fields are filled.
    assertTimeOutput(time);

    // Assert that onChange was not called
    expect(onChange).not.toHaveBeenCalled()
  });

  it('should updates correctly if the value prop changes', () => {
    // First render
    const time: Time = {
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    };
    const onChange = jest.fn();
    const screen = render(<TimeInput value={time} onChange={onChange} />);
    assertTimeOutput(time);

    // Second render with changed time prop
    const changedTime: Time = {
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 666,
    };
    screen.rerender(<TimeInput value={changedTime} onChange={onChange} />);
    assertTimeOutput(changedTime);

    // Assert that onChange was not called
    expect(onChange).not.toHaveBeenCalled()
  });

  //
  // User input tests
  //
  it('should call onChange for each field change', () => {
    // First render
    const time: Time = {
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    };
    const onChange = jest.fn();
    render(<TimeInput value={time} onChange={onChange} />);

    const daysInput = getInputElementByLabelText(/day/i);
    const hoursInput = getInputElementByLabelText(/hour/i);
    const minutesInput = getInputElementByLabelText(/minute/i);
    const secondsInput = getInputElementByLabelText(/second/i);

    fireEvent.change(daysInput, { target: { value: '11' } });

    // Assert that onChange was not called
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).lastCalledWith({
      days: 11,
      hours: 2,
      minutes: 3,
      seconds: 4,
    });
    onChange.mockClear();

    fireEvent.change(daysInput, { target: { value: '111' } });
    fireEvent.change(hoursInput, { target: { value: '222' } });
    fireEvent.change(minutesInput, { target: { value: '333' } });
    fireEvent.change(secondsInput, { target: { value: '444' } });

    expect(onChange).toBeCalledTimes(4);
    expect(onChange.mock.calls).toEqual([
      [
        {
          days: 111,
          hours: 2,
          minutes: 3,
          seconds: 4,
        }
      ],
      [
        {
          days: 111,
          hours: 222,
          minutes: 3,
          seconds: 4,
        },
      ],
      [
        {
          days: 111,
          hours: 222,
          minutes: 333,
          seconds: 4,
        },
      ],
      [
        {
          days: 111,
          hours: 222,
          minutes: 333,
          seconds: 444,
        }
      ],
    ]);
  });

  it('should handle invalid inputs (also if the browser denies this)', () => {
    // First render
    const time: Time = {
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    };
    const onChange = jest.fn();
    render(<TimeInput value={time} onChange={onChange} />);

    const daysInput = getInputElementByLabelText(/day/i);
    const hoursInput = getInputElementByLabelText(/hour/i);

    fireEvent.change(daysInput, { target: { value: 'a' } });

    // Assert that onChange was not called
    expect(onChange).toBeCalledTimes(0);

    fireEvent.change(hoursInput, { target: { value: '222' } });

    // Assert that onChange was not called
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).lastCalledWith({
      days: 1,
      hours: 222,
      minutes: 3,
      seconds: 4,
    });
  });
});
