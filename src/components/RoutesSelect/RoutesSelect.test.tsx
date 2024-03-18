import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoutesSelect from './RoutesSelect';

const mockRoutes = ['Route 1', 'Route 2', 'Route 3'];
const mockSelectedRoutes = ['Route 1'];

describe('RoutesSelect component', () => {
  // Ensures that the component renders correctly with initial selected routes
  test('renders with initial selected routes', () => {
    render(
      <RoutesSelect
        routes={mockRoutes}
        selectedRoutes={mockSelectedRoutes}
        onChange={() => {}}
      />
    );

    mockSelectedRoutes.forEach(route => {
      expect(screen.getByText(route)).toBeInTheDocument();
    });
  });

  // Tests that all route options are displayed when the select dropdown is clicked
  test('displays all route options', async () => {
    render(
      <RoutesSelect
        routes={mockRoutes}
        selectedRoutes={mockSelectedRoutes}
        onChange={() => {}}
      />
    );

    const select = screen.getByRole('combobox');
    userEvent.click(select);

    mockRoutes.forEach(async route => {
      expect(await screen.findByText(route)).toBeInTheDocument();
    });
  });

  // Verifies that the box width adjusts based on the number of selected routes
  test('adjusts box width based on the number of selected routes', () => {
    const moreSelectedRoutes = ['Route 1', 'Route 2', 'Route 3'];
    render(
      <RoutesSelect
        routes={mockRoutes}
        selectedRoutes={moreSelectedRoutes}
        onChange={() => {}}
      />
    );

    const box = screen.getByTestId('selected-chips-box');
    expect(box).toHaveStyle('width: 300px');
  });
});
