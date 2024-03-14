import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface StationsCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * `StationsCheckbox` is a component for toggling the visibility of stations on a chart.
 * It renders a checkbox that allows users to show or hide stations.
 *
 * @component
 * @param {StationsCheckboxProps} props - The props for the StationsCheckbox component.
 * @param {boolean} props.checked - Indicates whether the checkbox is checked.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Handler for checkbox state change.
 */
const StationsCheckbox: React.FC<StationsCheckboxProps> = ({
  checked,
  onChange,
}) => {
  return (
    <FormControlLabel
      sx={{
        alignSelf: 'center',
        width: '120px',
        marginLeft: '10px',
        marginRight: '50px',
      }}
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      }
      label="Stationen anzeigen"
    />
  );
};

export default StationsCheckbox;
