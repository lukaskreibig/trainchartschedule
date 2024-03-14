import React from 'react';
import { Slider, Box } from '@mui/material';

/**
 * Defines the props for the TimeRangeSlider component.
 * @param {number[]} timeRange - The current selected time range.
 * @param {(event: Event, newValue: number | number[]) => void} onTimeRangeChange - Callback function for slider value change.
 * @param {(event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) => void} onTimeRangeChangeCommitted - Callback for when the slider change is committed (e.g., on mouse-up).
 * @param {{ value: number; label: string }[]} marks - The marks on the slider, each with a specified value and label.
 */
interface TimeRangeSliderProps {
  timeRange: number[];
  onTimeRangeChange: (event: Event, newValue: number | number[]) => void;
  onTimeRangeChangeCommitted: (
    event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[]
  ) => void;
  marks: { value: number; label: string }[];
}

/**
 * TimeRangeSlider component for selecting a time range using a slider.
 * Utilizes Material-UI's Slider component to offer an interactive time range selection.
 * @param {TimeRangeSliderProps} props - Component props.
 */
const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({
  timeRange,
  onTimeRangeChange,
  onTimeRangeChangeCommitted,
  marks,
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
