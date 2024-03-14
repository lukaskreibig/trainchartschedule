import React from 'react';
import { Slider, Box } from '@mui/material';
import { marks } from '../app/constants';

interface SliderControlProps {
  timeRange: number[];
  setTimeRange: (newRange: number[]) => void;
  tempTimeRange: number | number[];
  setTempTimeRange: (newRange: number | number[]) => void;
}

const SliderControl: React.FC<SliderControlProps> = ({
  setTimeRange,
  tempTimeRange,
  setTempTimeRange,
}) => {
  const handleSliderChange = (event: Event, newValue: number | number[]): void => {
    setTempTimeRange(newValue);
  };

  /**
   * Commits the time range selection when the user stops sliding the range selector.
   * @param event The event object.
   * @param newValue The new value of the time range slider.
   */
  const handleSliderChangeCommitted = (event: Event, newValue: number | number[]): void => {
    setTimeRange(newValue as number[]);
  };

  const valueLabelFormat = (value: number): string => {
    const hours = Math.floor(value);
    const minutes = (value - hours) * 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ width: '600px', alignSelf: 'center' }}>
      <Slider
        getAriaLabel={() => 'Time range'}
        value={tempTimeRange}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderChangeCommitted}
        valueLabelDisplay="auto"
        min={0}
        max={24}
        marks={marks}
        step={0.5}
        valueLabelFormat={valueLabelFormat}
      />
    </Box>
  );
};

export default SliderControl;
