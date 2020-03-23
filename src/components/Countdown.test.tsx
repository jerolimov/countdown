import React from 'react';
import { render, screen } from '@testing-library/react';

import Countdown from './Countdown';

describe('Countdown', () => {

  it('render rest time successfully', () => {
    // Test without rest time
    render(<Countdown startedAt={new Date()} paused restTimeInMs={0.500} />);
    screen.getByText(/00:00.\d{3}/);

    // Test with 30 seconds rest time
    render(<Countdown startedAt={new Date()} paused restTimeInMs={30500} />);
    screen.getByText(/00:30.\d{3}/);
  });

});
