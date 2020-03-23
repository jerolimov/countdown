import React from 'react';
import { render, screen } from '@testing-library/react';

import Countdown from './Countdown';

describe('Countdown', () => {

  it('should render four labeled input fields', () => {
    render(<Countdown paused until={0} />);

    // Assert labels
    screen.getByText(/00:00.\d{3}/);
  });

});
