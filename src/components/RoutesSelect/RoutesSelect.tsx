import React from 'react';
import {
  Box,
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface RoutesSelectProps {
  routes: string[];
  selectedRoutes: string[];
  onChange: (event: SelectChangeEvent<string[]>) => void;
}

/**
 * `RoutesSelect` is a component for selecting multiple routes from a dropdown list.
 * It utilizes Material-UI's `Select` component for rendering the dropdown and
 * displays the selected items using `Chip` components within a `Box`.
 *
 * @component
 * @param {RoutesSelectProps} props - The props for the RoutesSelect component.
 * @param {string[]} props.routes - Array of route options to display in the select dropdown.
 * @param {string[]} props.selectedRoutes - Array of currently selected routes.
 * @param {(event: SelectChangeEvent<string[]>) => void} props.onChange - Handler for when the selection changes.
 */
const RoutesSelect: React.FC<RoutesSelectProps> = ({
  routes,
  selectedRoutes,
  onChange,
}) => {
  return (
    <Select
      labelId="routes-select-label"
      id="routes-select"
      multiple
      value={selectedRoutes}
      onChange={onChange}
      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
      renderValue={selected => (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            width: selectedRoutes.length >= 3 ? '300px' : '100px',
          }}
          data-testid="selected-chips-box"
        >
          {selected.map(value => (
            <Chip key={value} label={value} />
          ))}
        </Box>
      )}
    >
      {routes.map(name => (
        <MenuItem key={name} value={name}>
          {name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default RoutesSelect;
