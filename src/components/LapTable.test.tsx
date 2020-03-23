import React from 'react';
import { render, screen, getByText } from '@testing-library/react';

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
    const rowWithLap1 = screen.getByText('1').parentElement!;
    getByText(rowWithLap1, '1')
    getByText(rowWithLap1, '15000')
    getByText(rowWithLap1, '3/22/2020')
    getByText(rowWithLap1, '2:00:45 PM')

    const rowWithLap2 = screen.getByText('2').parentElement!;
    getByText(rowWithLap2, '2')
    getByText(rowWithLap2, '10000')
    getByText(rowWithLap2, '3/22/2020')
    getByText(rowWithLap2, '2:00:55 PM')
  });

});
