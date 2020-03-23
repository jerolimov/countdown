import React from 'react';
import { render } from '@testing-library/react';

import Countdown from './Countdown';

describe('Countdown', () => {

  it('should render without rest time', async () => {
    // Test without rest time
    const screen = render(<Countdown startedAt={new Date()} paused restTimeInMs={0.500} />);
    screen.getByText(/00:00.\d{3}/);
  });

  it('should render with 30 seconds rest time', async () => {
    const screen = render(<Countdown startedAt={new Date()} paused restTimeInMs={30500} />);
    screen.getByText(/00:30.\d{3}/);
  });

});
