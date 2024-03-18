'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { type SelectChangeEvent } from '@mui/material';
import { IProcessedData } from '@/app/types';
import { routes } from './constants';
import { OVERLAY_STYLES } from './constants';
import SliderControl from '@/components/SliderControl';
import StationsCheckbox from '@/components/StationsCheckbox';
import RoutesSelect from '@/components/RoutesSelect';
import Chart from '@/components/Chart';
import * as d3 from 'd3';

/**
 * The TrainScheduleChart component displays a visual chart of train schedules.
 * Utilizes D3 for chart generation and MUI components for UI elements.
 */
const TrainScheduleChart: React.FC = () => {
  // State hooks to manage component state
  const [fetchData, setFetchData] = useState<IProcessedData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Tracks data loading status
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(['S3']); // Selected routes for filtering
  const [stations, setStations] = useState<boolean>(true); // Toggle to show/hide stations on the chart
  const [processedData, setProcessedData] = useState<IProcessedData[] | null>(
    null
  );

  const parseTime = d3.timeParse('%H:%M:%S');
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

  // The time range selected by the user is converted to seconds to match the dataset's format.
  const startSeconds = timeRange[0] * 3600;
  const endSeconds = timeRange[1] * 3600;

  /**
   * Converts a time string to the total number of seconds since the start of the day.
   *
   * @param {string} timeString - The time string in the format "HH:MM:SS".
   * @returns {number} The total number of seconds since the start of the day.
   */
  const timeStringToSeconds = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  /**
   * Fetches GTFS (General Transit Feed Specification) data for processing and visualization.
   * This function simulates a data fetch operation and processes the data for D3 charting.
   */
  useEffect(() => {
    const fetchGTFSData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/importgtfs', { method: 'GET' });
        const data = await response.json();
        setFetchData(data.tripsWithStopTimes);
        processData(data.tripsWithStopTimes);
      } catch (error) {
        console.error('Failed to load GTFS data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGTFSData();
  }, []);

  useEffect(() => {
    if (fetchData) {
      processData(fetchData);
    }
  }, [fetchData, selectedRoutes, timeRange]);

  /**
   * Transforms raw GTFS data into a structure suitable for visualization with D3.
   * This involves filtering trips based on user-selected routes, mapping stop times to these trips,
   * and then filtering these based on the selected time range. The result is an array of trips
   * each containing a list of stops with enriched information for charting.
   *
   * @param {IProcessedData[]} data - The raw GTFS data including trips, stops, and stop times.
   * @returns {IProcessedData[]} - An array of processed data, with each trip containing a list of stops
   *                                and associated data ready for visualization.
   */
  const processData = useCallback(
    (data: IProcessedData[]) => {
      // Slicing the route prefix and filtering trips by the selected routes
      const filteredTrips = data.filter(trip =>
        selectedRoutes.includes(trip.route_short_name)
      );
      const enrichedTrips = filteredTrips.map(trip => ({
        ...trip,
        stops: trip.stops
          .map(stop => ({
            ...stop,
            route_short_name: trip.route_short_name,
            trip_headsign: trip.trip_headsign,
            originalArrivalTime: parseTime(stop.arrival_time)!,
            originalDepartureTime: parseTime(stop.departure_time)!,
            arrival_timestamp: timeStringToSeconds(stop.arrival_time),
            departure_timestamp: timeStringToSeconds(stop.departure_time),
          }))
          .filter(
            st =>
              st.arrival_timestamp >= startSeconds &&
              st.departure_timestamp <= endSeconds
          ),
      }));
      setProcessedData(enrichedTrips);
      setLoading(false);
    },
    [selectedRoutes, timeRange]
  );

  const handleRouteChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;

    const newSelectedRoutes = typeof value === 'string' ? [value] : value;

    // Prevent deselecting all options - there should be at least one selected route
    if (newSelectedRoutes.length === 0) {
      return;
    }

    setSelectedRoutes(newSelectedRoutes);
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
      {!loading ? (
        <>
          <div style={OVERLAY_STYLES}>
            <RoutesSelect
              routes={routes}
              selectedRoutes={selectedRoutes}
              onChange={handleRouteChange}
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
          <Chart
            processedData={processedData}
            stationsVisible={stations}
            selectedRoutes={selectedRoutes}
          />
        </>
      ) : (
        'Loading'
      )}
    </Container>
  );
};

export default TrainScheduleChart;
