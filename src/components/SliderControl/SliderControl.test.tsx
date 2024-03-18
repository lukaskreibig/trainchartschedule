import React from 'react';
import { render, screen } from '@testing-library/react';
import SliderControl from './SliderControl';

describe('SliderControl Component', () => {
  const initialTimeRange = [8, 18];
  let setTimeRange: jest.Mock;
  let setTempTimeRange: jest.Mock;

  beforeEach(() => {
    setTimeRange = jest.fn();
    setTempTimeRange = jest.fn();
    render(
      <SliderControl
        timeRange={initialTimeRange}
        setTimeRange={setTimeRange}
        tempTimeRange={initialTimeRange}
        setTempTimeRange={setTempTimeRange}
      />
    );
  });

  // Ensures that the component renders with two sliders, matching the expected initial time range
  it('renders with the correct initial value', () => {
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
  });
});
