import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface StationsCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

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
