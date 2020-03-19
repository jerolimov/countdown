import React from 'react';
import { render, getByDisplayValue, fireEvent, screen } from '@testing-library/react';

import TimeInput from './TimeInput';

test('allows the user to login successfully', async () => {

  render(
    <TimeInput
      onChange={(time) => console.log('onChange within test')}
    />
  )

  screen.getByLabelText(/day/i);
  screen.getByLabelText(/hour/i);
  screen.getByLabelText(/minute/i);
  screen.getByLabelText(/second/i);

  const dayInput = getByDisplayValue(
    screen.getByLabelText(/day/i).parentElement!,
    '0'
  );

  const hourInput = getByDisplayValue(
    screen.getByLabelText(/hour/i).parentElement!,
    '00'
  );

  fireEvent.change(dayInput, { target: {value: '1'} });
  fireEvent.change(hourInput, { target: {value: '2'} });

});
