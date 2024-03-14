import React from 'react';
import { Slider, Box } from '@mui/material';
import { marks } from '../app/constants';

/**
 * Props for SliderControl component.
 *
 * @interface
 * @property {number[]} timeRange - The current selected time range.
 * @property {(newRange: number[]) => void} setTimeRange - Function to set the new time range.
 * @property {number | number[]} tempTimeRange - The temporary time range value while sliding.
 * @property {(newRange: number | number[]) => void} setTempTimeRange - Function to set the temporary time range.
 */
interface SliderControlProps {
  timeRange: number[];
  setTimeRange: (newRange: number[]) => void;
  tempTimeRange: number | number[];
  setTempTimeRange: (newRange: number | number[]) => void;
}

/**
 * A slider component for controlling a time range.
 *
 * @param {SliderControlProps} props - The props for the component.
 * @returns {React.ReactElement} The SliderControl component.
 */
const SliderControl: React.FC<SliderControlProps> = ({
  timeRange,
  setTimeRange,
  tempTimeRange,
  setTempTimeRange,
}) => {
  /**
   * Handles slider value change.
   *
   * @param {Event} event - The event object.
   * @param {number | number[]} newValue - The new value of the slider.
   */
  const handleSliderChange = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ): void => {
    setTempTimeRange(newValue);
  };

  /**
   * Commits the time range selection when the user stops sliding the range selector.
   *
   * @param {React.SyntheticEvent | Event} event - The event object.
   * @param {number | number[]} newValue - The new value of the time range slider.
   */
  const handleSliderChangeCommitted = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ): void => {
    setTimeRange(newValue as number[]);
  };

  /**
   * Formats the slider's label.
   *
   * @param {number} value - The current value of the slider.
   * @returns {string} The formatted value label.
   */
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
