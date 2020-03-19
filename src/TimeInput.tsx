import React, { useState } from 'react';

import { Split, Stack, TextInput } from '@patternfly/react-core';

const timeSlots = [
  { key: 'days', label: 'Days', factor: 24 * 60 * 60 },
  { key: 'hours', label: 'Hours', factor: 60 * 60 },
  { key: 'minutes', label: 'Minutes', factor: 60 },
  { key: 'seconds', label: 'Seconds', factor: 1 },
];

export interface TimeInputProps {
  onChange: (time: number) => void,
};

export default function TimeInput({ onChange }: TimeInputProps) {

  const [timeValues, setTimeValues] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const updateTimeValues = (key: string, value: string) => {
    setTimeValues({ ...timeValues, [key]: value })
  };

  const [secondsOverall] = useState(0);

  const onBlur = () => {
    console.warn('onBlur');
  };

  const onChangeField = (value: string, event: React.FormEvent<HTMLInputElement>) => {
    const key = event.currentTarget.getAttribute('data-field');
    console.warn('onChange', key, value);
    if (key) {
      updateTimeValues(key, value);
    }
    if (onChange) {
      onChange(1);
    }
  };

  return (
    <Stack>
      <Split>
        {timeSlots.map((timeSlot, index) => (
          <Stack key={timeSlot.key} component="label">
            {timeSlot.label}
            <TextInput
              aria-label="Time input"
              data-field={timeSlot.key}
              defaultValue={index === 0 ? '0' : '00'}
              type="number"
              css=""
              onBlur={onBlur}
              onChange={onChangeField}
              style={{ textAlign: 'right', width: 80 }}
            />
          </Stack>
        ))}
      </Split>
      <p>
        <strong>timeValues: {JSON.stringify(timeValues)}</strong>
      </p>
      <p>
        <strong>seconds overall: {secondsOverall}</strong>
      </p>
    </Stack>
  );
}
