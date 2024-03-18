import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StationsCheckbox from './StationsCheckbox';
import '@testing-library/jest-dom';

describe('StationsCheckbox Component', () => {
  test('renders correctly with initial checked state', () => {
    const handleChange = jest.fn();
    const checked = false;
    render(<StationsCheckbox checked={checked} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('calls onChange handler when clicked', () => {
    const handleChange = jest.fn();
    const checked = false;
    render(<StationsCheckbox checked={checked} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('reflects the new checked state when clicked', () => {
    const Container = () => {
      const [isChecked, setIsChecked] = React.useState(false);
      return (
        <StationsCheckbox
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
      );
    };

    render(<Container />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
