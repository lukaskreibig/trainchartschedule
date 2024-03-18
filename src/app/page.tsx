'use client';
import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import * as d3 from 'd3';
import { type SelectChangeEvent } from '@mui/material';
import { IData, IProcessedData, IStop } from '@/app/types';
import { routes } from './constants';
import { OVERLAY_STYLES } from './constants';
import SliderControl from '@/components/SliderControl';
import StationsCheckbox from '@/components/StationsCheckbox';
import RoutesSelect from '@/components/RoutesSelect';
import Chart from '@/components/Chart';

/**
 * The TrainScheduleChart component displays a visual chart of train schedules.
 * Utilizes D3 for chart generation and MUI components for UI elements.
 */
const TrainScheduleChart: React.FC = () => {
  // State hooks to manage component state
  const [loading, setLoading] = useState<boolean>(false); // Tracks data loading status
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(['S1']); // Selected routes for filtering
  const [stations, setStations] = useState<boolean>(true); // Toggle to show/hide stations on the chart
  const [processedData, setProcessedData] = useState<IProcessedData[] | null>(
    null
  );

  const now = new Date();
  const currentHour = now.getHours();
  // Calculate an end hour for the initial time range, ensuring it doesn't exceed 24 hours
  let endHour = currentHour + 4;
  if (endHour > 24) endHour = 24;

  // State for managing the selected time range for filtering schedules
  const [timeRange, setTimeRange] = useState<number[]>([currentHour, endHour]);

  // Temporary state to hold the slider value during adjustment
  const [tempTimeRange, setTempTimeRange] = useState<number | number[]>(
    timeRange
  );


  /**
   * Fetches GTFS (General Transit Feed Specification) data for processing and visualization.
   * This function simulates a data fetch operation and processes the data for D3 charting.
   */
  const fetchGTFSData = async (): Promise<void> => {
    setLoading(true);
    let data: IData | null;
    try {
      const response = await fetch('/api', { method: 'POST' });
      data = await response.json();
    } catch (error) {
      console.error('Failed to load GTFS data:', error);
      data = null;
    } finally {
    }
    if (data !== null) {
      const processedData = processData(data);
      setProcessedData(processedData);
    }
    setLoading(false);
  };

  // Fetch GTFS data when component mounts or when filters change
  useEffect(() => {
    fetchGTFSData();
  }, [selectedRoutes, stations, timeRange]);

  /**
   * Transforms raw GTFS data into a structure suitable for visualization with D3.
   * This involves filtering trips based on user-selected routes, mapping stop times to these trips,
   * and then filtering these based on the selected time range. The result is an array of trips
   * each containing a list of stops with enriched information for charting.
   *
   * @param {IData} data - The raw GTFS data including trips, stops, and stop times.
   * @returns {IProcessedData[]} - An array of processed data, with each trip containing a list of stops
   *                                and associated data ready for visualization.
   */
  const processData = ({
    stops,
    trips,
    stoptimes,
  }: IData): IProcessedData[] => {
    // Mapping stops for quick access by their ID, enhancing lookup efficiency.
    const stopsById: Record<string, IStop> = stops.reduce(
      (acc: Record<string, IStop>, stop) => {
        acc[stop.stop_id] = stop;
        return acc;
      },
      {} satisfies Record<string, IStop>
    );
    // Slicing the route prefix and filtering trips by the selected routes
    const routesSliced = selectedRoutes.map(str => str.slice(1));
    // Filter trips by selected routes. This is an initial filtration step to reduce the dataset.
    const filteredTrips = trips.filter(trip =>
      routesSliced.includes(trip.route_id)
    );

    // The time range selected by the user is converted to seconds to match the dataset's format.
    const startSeconds = timeRange[0] * 3600;
    const endSeconds = timeRange[1] * 3600;

    // Further processing to map stop times to each trip, including sorting and filtering by time range.
    const tripsWithStoptimes = filteredTrips.map(trip => {
      // Filter and sort the stop times for this trip, then map additional stop information.
      const tripStoptimes = stoptimes
        .filter(st => st.trip_id === trip.trip_id)
        .sort((a, b) => a.stop_sequence - b.stop_sequence)
        .map(st => {
          const stopInfo = stopsById[st.stop_id];
          return {
            ...st,
            ...stopInfo,
            // Convert times into JavaScript Date objects for easier manipulation and formatting.
            originalArrivalTime: d3.timeParse('%H:%M:%S')(st.arrival_time)!,
            originalDepartureTime: d3.timeParse('%H:%M:%S')(st.departure_time)!,
            arrival_timestamp: st.arrival_timestamp,
            departure_timestamp: st.departure_timestamp,
            trip_headsign: trip.trip_headsign,
            route_id: trip.route_id,
          };
        })
        .filter(
          st =>
            st.arrival_timestamp >= startSeconds &&
            st.arrival_timestamp <= endSeconds
        );
      return { ...trip, stops: tripStoptimes };
    });
    // Filter out any trips that do not have any stop times within the selected time range.
    return tripsWithStoptimes.filter(trip => trip.stops.length > 0);
  };

  /**
   * Utilizes D3 to create a visual representation of the processed GTFS data.
   * This function sets up the SVG canvas, scales, axes, and plots each trip as a line connecting its stops.
   * Additional functionalities include tooltips for stop information and dynamic scaling based on the data.
   *
   * @param {IProcessedData[]} tripsData - The processed data array, where each item represents a trip
   *                                        with its stops ready for visualization.
   */

  return (
    <Container maxWidth="lg">
      <div style={OVERLAY_STYLES}>
        <RoutesSelect
          routes={routes}
          selectedRoutes={selectedRoutes}
          onChange={(event: SelectChangeEvent<string[]>) => {
            const value = event.target.value;
            // On autofill we get a stringified value.
            setSelectedRoutes(
              typeof value === 'string' ? value.split(',') : value
            );
          }}
        />
        <StationsCheckbox
          checked={stations}
          onChange={e => setStations(e.target.checked)}
        />
        <SliderControl
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          tempTimeRange={tempTimeRange}
          setTempTimeRange={setTempTimeRange}
        />
      </div>
      <Chart processedData={processedData} stationsVisible={stations} />
    </Container>
  );
};

export default TrainScheduleChart;
