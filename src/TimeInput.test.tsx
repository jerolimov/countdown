import React from 'react';
import { render, getByDisplayValue, fireEvent, screen, Matcher } from '@testing-library/react';

import TimeInput, { Time } from './TimeInput';

describe('TimeInput', () => {

  const getInputElementByLabelText = (matcher: Matcher) =>
    screen.getByLabelText(matcher).parentElement!.lastElementChild!;

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

    // Assert time output
    screen.getByDisplayValue('1');
    screen.getByDisplayValue('2');
    screen.getByDisplayValue('3');
    screen.getByDisplayValue('4');

    // Assert that the right input fields are filled.
    getByDisplayValue(screen.getByLabelText(/day/i).parentElement!, '1');
    getByDisplayValue(screen.getByLabelText(/hour/i).parentElement!, '2');
    getByDisplayValue(screen.getByLabelText(/minute/i).parentElement!, '3');
    getByDisplayValue(screen.getByLabelText(/second/i).parentElement!, '4');

    // Alternative without parentElement!
    expect(getInputElementByLabelText(/day/i)?.getAttribute('value')).toBe('1');
    expect(getInputElementByLabelText(/hour/i)?.getAttribute('value')).toBe('2');
    expect(getInputElementByLabelText(/minute/i)?.getAttribute('value')).toBe('3');
    expect(getInputElementByLabelText(/second/i)?.getAttribute('value')).toBe('4');

    // Assert that onChange was not called
    expect(onChange).not.toHaveBeenCalled()
  });

  const assertTimeOutput = (time: Time) => {
    expect(getInputElementByLabelText(/day/i)?.getAttribute('value')).toBe(time.days.toString());
    expect(getInputElementByLabelText(/hour/i)?.getAttribute('value')).toBe(time.hours.toString());
    expect(getInputElementByLabelText(/minute/i)?.getAttribute('value')).toBe(time.minutes.toString());
    expect(getInputElementByLabelText(/second/i)?.getAttribute('value')).toBe(time.seconds.toString());
  }

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

    const daysInput = getInputElementByLabelText(/day/i)!;
    const hoursInput = getInputElementByLabelText(/hour/i)!;
    const minutesInput = getInputElementByLabelText(/minute/i)!;
    const secondsInput = getInputElementByLabelText(/second/i)!;

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
});
