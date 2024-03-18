import React from 'react';
import { render, screen } from '@testing-library/react';
import Chart from './Chart';
import { IProcessedData } from '@/types/types';

const mockData: IProcessedData[] = [
  {
    route_short_name: '101',
    route_id: 'r101',
    service_id: 'weekday',
    trip_id: 't10101',
    trip_headsign: 'Filderstadt',
    trip_short_name: 'S5',
    direction_id: 1,
    block_id: 'b101',
    shape_id: 's101',
    wheelchair_accessible: 1,
    bikes_allowed: 0,
    stops: [
      {
        stop_id: '1001',
        stop_code: 'SC1001',
        stop_name: 'Vaihingen',
        tts_stop_name: null,
        stop_desc: 'Near the coffee shop',
        stop_lat: 47.609,
        stop_lon: -122.337,
        zone_id: null,
        stop_url: null,
        location_type: 0,
        parent_station: 'Station 1',
        stop_timezone: null,
        wheelchair_boarding: 1,
        level_id: null,
        platform_code: null,
        trip_id: 't10101',
        arrival_time: '08:00:00',
        arrival_timestamp: 8 * 60 * 60,
        departure_time: '08:05:00',
        departure_timestamp: 8 * 60 * 60 + 5 * 60,
        stop_sequence: 1,
        stop_headsign: null,
        pickup_type: 0,
        drop_off_type: 0,
        continuous_pickup: null,
        continuous_drop_off: null,
        shape_dist_traveled: null,
        timepoint: null,
        trip_headsign: 'Filderstadt',
        route_id: 'r101',
        originalArrivalTime: new Date('2024-03-18T08:00:00'),
        originalDepartureTime: new Date('2024-03-18T08:05:00'),
        route_short_name: '101',
      },
    ],
  },
];

describe('Chart component tests', () => {
  // Checks if the chart component renders without errors when provided with null data
  test('renders without crashing with null data', () => {
    render(
      <Chart processedData={null} stationsVisible={false} selectedRoutes={[]} />
    );
    expect(screen.getByTestId('chart-svg')).toBeInTheDocument();
  });

  // Verifies that the SVG element is correctly rendered when the component is provided with mock data
  test('renders SVG element correctly with mock data', () => {
    render(
      <Chart
        processedData={mockData}
        stationsVisible={true}
        selectedRoutes={['1']}
      />
    );
    expect(screen.getByTestId('chart-svg')).toBeInTheDocument();
  });

  // Ensures that axis labels are rendered correctly on the chart using mock data
  test('renders axis labels correctly', () => {
    render(
      <Chart
        processedData={mockData}
        stationsVisible={true}
        selectedRoutes={['1']}
      />
    );

    const xAxisLabel = screen.getByText('Vaihingen');
    const yAxisLabel = screen.getByText('08:00');

    expect(xAxisLabel).toBeInTheDocument();
    expect(yAxisLabel).toBeInTheDocument();
  });
});
