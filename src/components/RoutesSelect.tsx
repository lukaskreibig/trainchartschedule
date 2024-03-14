import React from 'react';
import { Box, Chip, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';

interface RoutesSelectProps {
  routes: string[];
  selectedRoutes: string[];
  onChange: (event: SelectChangeEvent<string[]>) => void;
}

const RoutesSelect: React.FC<RoutesSelectProps> = ({ routes, selectedRoutes, onChange }) => {
  return (
    <Select
      labelId="routes-select-label"
      id="routes-select"
      multiple
      value={selectedRoutes}
      onChange={onChange}
      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, width: selectedRoutes.length >= 3 ?  '300px' : "100px" }}>
          {selected.map((value) => (
            <Chip key={value} label={value} />
          ))}
        </Box>
      )}
    >
      {routes.map((name) => (
        <MenuItem
          key={name}
          value={name}
        >
          {name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default RoutesSelect;
