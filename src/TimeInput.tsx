import React, { useState, useEffect, FocusEvent } from 'react';

import { Split, Stack, TextInput } from '@patternfly/react-core';

export interface Time {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

export interface TimeInputProps {
  value?: Time,
  onChange?: (time: Time) => void,
};

type TimeSlot = 'days' | 'hours' | 'minutes' | 'seconds';
const timeSlots: Array<{ slot: TimeSlot, label: string, factor: number }> = [
  { slot: 'days', label: 'Days', factor: 24 * 60 * 60 },
  { slot: 'hours', label: 'Hours', factor: 60 * 60 },
  { slot: 'minutes', label: 'Minutes', factor: 60 },
  { slot: 'seconds', label: 'Seconds', factor: 1 },
];

export default function TimeInput({ value, onChange }: TimeInputProps) {
  // Keep a local 
  const [time, setTime] = useState<Time>(value || {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Adopt time if the 'controlled' prop 'value' changes
  useEffect(() => {
    if (value) {
      setTime(value);
    }
  }, [value])

  const onFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  const onChangeField = (value: string, event: React.FormEvent<HTMLInputElement>) => {
    const slot = event.currentTarget.getAttribute('data-slot');
    const val = parseInt(value);
    if (!slot || isNaN(val)) {
      return;
    }
    const newValue = { ...time, [slot]: val };
    setTime(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (value.length === 2) {
      // Focus next element without refs:
      // 1. parent of TextInput is Stack
      // 2. nextSibling of Stack is the next Stack
      // 3. Find the input text field and focus it.
      const parentStack = event.currentTarget.parentElement;
      const nextStack = parentStack?.nextElementSibling;
      const inputField = nextStack?.querySelector('input')
      inputField?.select();
    }
  };

  return (
    <Split>
      {timeSlots.map((timeSlot, index) => (
        <Stack key={timeSlot.slot} component="label">
          <strong>{timeSlot.label}</strong>
          <TextInput
            aria-label="Time input"
            data-slot={timeSlot.slot}
            type="number"
            css=""
            value={time[timeSlot.slot]}
            onFocus={onFocus}
            onChange={onChangeField}
            style={{ textAlign: 'right', width: 80 }}
          />
        </Stack>
      ))}
    </Split>
  );
}
