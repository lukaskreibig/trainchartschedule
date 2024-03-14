import React from 'react';
import { Slider, Box } from '@mui/material';

interface TimeRangeSliderProps {
  timeRange: number[];
  onTimeRangeChange: (event: Event, newValue: number | number[]) => void;
  onTimeRangeChangeCommitted: (event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) => void;
  marks: { value: number; label: string }[];
}

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({
  timeRange,
  onTimeRangeChange,
  onTimeRangeChangeCommitted,
  marks
}) => {
  return (
    <Box sx={{ width: '600px', alignSelf: 'center' }}>
      <Slider
        getAriaLabel={() => 'Time range'}
        value={timeRange}
        onChange={onTimeRangeChange}
        onChangeCommitted={onTimeRangeChangeCommitted}
        valueLabelDisplay="auto"
        min={0}
        max={24}
        marks={marks}
        step={0.5}
        valueLabelFormat={value => {
          const hours = Math.floor(value);
          const minutes = (value - hours) * 60;
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }}
      />
    </Box>
  );
};

export default TimeRangeSlider;
