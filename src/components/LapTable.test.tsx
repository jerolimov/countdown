import React from 'react';
import { render, screen } from '@testing-library/react';

import LapTable from './LapTable';
import { Lap } from '../types';

describe('LapTable', () => {

  it('should render four labeled input fields', () => {
    const laps: Lap[] = [
      {
        at: new Date('2020-03-22 14:00:55'),
        timeInMs: 10000,
      },
      {
        at: new Date('2020-03-22 14:00:45'),
        timeInMs: 15000,
      },
    ];

    render(<LapTable laps={laps} />);

    // Assert column header
    screen.getByText('Lap #');
    screen.getByText('Lap delta');
    screen.getByText('Lap date');
    screen.getByText('Lap time');

    // Assert column content
    screen.getByText('1');
    screen.getByText('10000');
    screen.getAllByText('3/22/2020');
    screen.getByText('2:00:55 PM');

    screen.getByText('2');
    screen.getByText('15000');
    screen.getAllByText('3/22/2020');
    screen.getByText('2:00:45 PM');
  });

});
