/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import * as d3 from 'd3';
import {
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  Slider,
  type Theme,
  useTheme,
} from '@mui/material';

interface ITrip {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign: string;
  trip_short_name: string | null;
  direction_id: number | null;
  block_id: string;
  shape_id: string | null;
  wheelchair_accessible: number | null;
  bikes_allowed: number | null;
}

interface IStop {
  stop_id: string;
  stop_code: string | null;
  stop_name: string | null;
  tts_stop_name: string | null;
  stop_desc: string | null;
  stop_lat: number;
  stop_lon: number;
  zone_id: string | null;
  stop_url: string | null;
  location_type: number;
  parent_station: string;
  stop_timezone: string | null;
  wheelchair_boarding: number | null;
  level_id: string | null;
  platform_code: string | null;
}

interface IStopTime {
  trip_id: string;
  arrival_time: string;
  arrival_timestamp: number;
  departure_time: string;
  departure_timestamp: number;
  stop_id: string;
  stop_sequence: number;
  stop_headsign: string | null;
  pickup_type: number;
  drop_off_type: number;
  continuous_pickup: number | null;
  continuous_drop_off: number | null;
  shape_dist_traveled: number | null;
  timepoint: number | null;
}

interface IData {
  trips: ITrip[];
  stops: IStop[];
  stoptimes: IStopTime[];
}

interface IProcessedData {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign: string;
  trip_short_name: string | null;
  direction_id: number | null;
  block_id: string;
  shape_id: string | null;
  wheelchair_accessible: number | null;
  bikes_allowed: number | null;
  stops: IProcessedStop[];
}

interface IProcessedStop {
  stop_id: string;
  stop_code: string | null;
  stop_name: string | null;
  tts_stop_name: string | null;
  stop_desc: string | null;
  stop_lat: number;
  stop_lon: number;
  zone_id: string | null;
  stop_url: string | null;
  location_type: number;
  parent_station: string;
  stop_timezone: string | null;
  wheelchair_boarding: number | null;
  level_id: string | null;
  platform_code: string | null;
  trip_id: string;
  arrival_time: string;
  arrival_timestamp: number;
  departure_time: string;
  departure_timestamp: number;
  stop_sequence: number;
  stop_headsign: string | null;
  pickup_type: number;
  drop_off_type: number;
  continuous_pickup: number | null;
  continuous_drop_off: number | null;
  shape_dist_traveled: number | null;
  timepoint: number | null;
  trip_headsign: string;
  route_id: string;
  originalArrivalTime: Date;
  originalDepartureTime: Date;
}

interface ID3Point {
  stop_name: string | null;
  time?: Date;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const routes = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];

const marks = [
  {
    value: 0,
    label: '00:00 Uhr',
  },
  {
    value: 12,
    label: '12:00 Uhr',
  },
  {
    value: 24,
    label: '24:00 Uhr',
  },
];

/**
 * Utility function to calculate dynamic styles for route selection.
 * @param name The name of the route.
 * @param route The current selected routes.
 * @param theme The MUI theme object for styling.
 * @returns A style object for fontWeight.
 */
function getStyles(
  name: string,
  route: readonly string[],
  theme: Theme
): { fontWeight: React.CSSProperties['fontWeight'] } {
  return {
    fontWeight: !route.includes(name)
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
  };
}

/**
 * The TrainScheduleChart component displays a visual chart of train schedules.
 * Utilizes D3 for chart generation and MUI components for UI elements.
 */
const TrainScheduleChart: React.FC = () => {
  // State hooks to manage component state
  const [loading, setLoading] = useState<boolean>(false); // Tracks data loading status
  const svgRef = useRef(null);
  const theme = useTheme();
  const [route, setRoute] = useState<string[]>(['S1']); // Selected routes for filtering
  const [stations, setStations] = useState<boolean>(true); // Toggle to show/hide stations on the chart

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

  // Styles for the overlay containing the filters and controls
  const overlayStyles: CSSProperties = {
    position: 'fixed',
    bottom: '20px', // 20px from the bottom of the viewport
    left: '50%', // Start at the half width of the viewport
    transform: 'translateX(-50%)', // Center horizontally
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    padding: '10px',
    paddingRight: '50px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000, // Make sure it's on top of other elements
    display: 'flex',
    flexDirection: 'row', // Stack elements vertically
    gap: '10px', // Space between elements
    alignItems: 'center', // Center items inside the overlay horizontally
    maxWidth: 'calc(100% - 40px)', // Prevent overlay from reaching the very edge of the scree
    width: '60%',
  };

  /**
   * Commits the time range selection when the user stops sliding the range selector.
   * @param event The event object.
   * @param newValue The new value of the time range slider.
   */
  const handleSliderChangeCommitted = (
    event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[]
  ): void => {
    setTimeRange(newValue as number[]);
  };

  /**
   * Handles changes to the stations checkbox, toggling the visibility of stations on the chart.
   * @param event The event object containing the new checkbox state.
   */
  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setStations(event.target.checked);
  };

  /**
   * Handles changes to the route selection.
   * @param event The event object containing the new selection.
   */
  const handleChange = (event: SelectChangeEvent<typeof route>): void => {
    const {
      target: { value },
    } = event;
    setRoute(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

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
      setLoading(false);
    }

    if (data != null) {
      const processedData = processData(data);
      console.log('processedData', processedData);
      createChart(processedData);
    }
  };

  // Fetch GTFS data when component mounts or when filters change
  useEffect(() => {
    void fetchGTFSData();
  }, [route, stations, timeRange]);

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
    const routesSliced = route.map(str => str.slice(1));
    // Filter trips by selected routes. This is an initial filtration step to reduce the dataset.
    const filteredTrips = trips.filter(trip =>
      routesSliced.includes(trip.route_id)
    );

    // The time range selected by the user is converted to seconds to match the dataset's format.
    const startSeconds = timeRange[0] * 3600;
    const endSeconds = timeRange[1] * 3600;

    console.log('filteredTrips', filteredTrips);
    console.log('stop', stops);
    console.log('trips', trips);
    console.log('stoptimes', stoptimes);
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
  const createChart = (tripsData: IProcessedData[]): void => {
    const margin = { top: 100, right: 50, bottom: 50, left: 100 };
    const width = 1280 - margin.left - margin.right;
    const height = 4000 - margin.top - margin.bottom;

    // Clear previous SVG content to prevent duplication.
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up the SVG canvas dimensions and margins.
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define the x and y scales based on the data. The xScale is categorical (stop names), and the yScale is time.
    const xScale = d3
      .scaleBand()
      .domain(
        tripsData
          .flatMap(trip => trip.stops.map(stop => stop.stop_name))
          .filter((name): name is string => name !== null)
      )
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleTime()
      .domain(
        d3.extent(
          tripsData
            .flatMap(trip => trip.stops)
            .map(stop => stop.originalArrivalTime)
        ) as [Date, Date]
      )
      .range([0, height]);

    const xAxis = d3.axisTop(xScale);

    const xGrid = d3
      .axisTop(xScale)
      .tickSize(-height) // Use the negative height to extend the lines downward
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // @ts-expect-error
      .tickFormat('')
      .tickPadding(10)
      .tickSizeOuter(0);

    // Append the grid to the chart
    svg
      .append('g')
      .attr('class', 'x-grid')
      .attr('transform', `translate(0,0)`) // Align with the top axis
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // @ts-expect-error
      .call(xGrid);

    // Style the grid lines to be dashed
    svg
      .selectAll('.x-grid line')
      .style('stroke', '#ddd')
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.9);

    svg.selectAll('.x-grid .domain').remove();

    const xAxisGroup = svg.append('g').call(xAxis);

    xAxisGroup
      .selectAll('line')
      .style('stroke', '#ddd')
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.9);

    // Style the text labels
    xAxisGroup
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('dx', '0.5em')
      .attr('dy', '0.5em')
      .attr('transform', 'rotate(-30)');

    // Add the y-axis to the left, formatting the time display.
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat(
        d3.timeFormat('%H:%M') as unknown as (
          domainValue: Date | d3.NumberValue,
          index: number
        ) => string
      )
      .tickSize(-width)
      .ticks(d3.timeMinute.every(30));

    svg
      .append('g')
      .call(yAxis)
      .selectAll('line')
      .style('stroke', '#ddd')
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.9);

    svg.selectAll('.domain').remove();

    // Plot each trip as a line through its stops. Color-coded by route_id for differentiation.
    const colorScale = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(tripsData.map(d => d.route_id));

    // const lineGenerator = d3.line()
    //   .x(d => xScale(d.stop_name) + xScale.bandwidth() / 2)
    //   .y(d => yScale(d.time))
    //   .curve(d3.curveMonotoneX);
    const lineGenerator = d3
      .line<ID3Point>()
      .x(d => xScale(d.stop_name!)! + xScale.bandwidth() / 2) // Ensure stop_name is not null or handle it appropriately
      .y(d => yScale(d.time!)) // ID3Point includes time, so this is valid
      .curve(d3.curveLinear);

    tripsData.forEach(trip => {
      svg
        .append('path')
        .datum(trip.stops)
        .attr('fill', 'none')
        .attr('stroke', colorScale(trip.route_id))
        .attr('stroke-width', 1)
        .attr('d', lineGenerator);
    });

    // Format function for time
    const formatTime = d3.timeFormat('%H:%M');

    tripsData.forEach(trip => {
      const points = [];

      // Loop through each stop, but not the last one, as we want to get the next stop's arrival
      for (let i = 0; i < trip.stops.length - 1; i++) {
        points.push({
          stop_name: trip.stops[i].stop_name,
          time: trip.stops[i].originalDepartureTime,
        });
        points.push({
          stop_name: trip.stops[i + 1].stop_name,
          time: trip.stops[i + 1].originalArrivalTime,
        });
      }

      // Draw the line for this trip
      svg
        .append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', colorScale(trip.route_id))
        .attr('stroke-width', 1)
        .attr('d', lineGenerator);
    });

    tripsData.forEach(trip => {
      trip.stops.forEach(stop => {
        // const circles = svg.selectAll('.stop-circle')
        svg
          .append('circle')
          // .attr('class', 'stop-circle')
          .attr('cx', () => xScale(stop.stop_name!)! + xScale.bandwidth() / 2)
          .attr('cy', () => yScale(stop.originalArrivalTime))
          .attr('r', 3)
          .attr('fill', 'rgba(0,0,0,0.5)') // Use rgba for transparency
          .attr('stroke', 'white') // White color around the dot
          .attr('stroke-width', '2px'); // Width of the white stroke to create the space
      });
    });

    // Tooltip setup
    const tooltip = svg
      .append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

    const path = tooltip
      .append('path')
      .attr('fill', 'white')
      .attr('stroke', '#000');

    const text = tooltip
      .append('text')
      .style('font', '10px sans-serif')
      .attr('fill', 'black'); // Set text fill to black if needed

    const line1 = text.append('tspan').style('font-weight', 'bold');

    const line2 = text.append('tspan').attr('x', 0).attr('dy', '1.1em');

    const line3 = text.append('tspan').attr('x', 0).attr('dy', '1.1em');

    const line4 = text.append('tspan').attr('x', 0).attr('dy', '1.1em');

    const allStops = tripsData.flatMap(trip =>
      trip.stops.map(stop => ({
        ...stop,
        x: xScale(stop.stop_name!)! + xScale.bandwidth() / 2,
        y: yScale(stop.originalArrivalTime),
      }))
    );

    // Create the Voronoi diagram
    const voronoi = d3.Delaunay.from(
      allStops,
      d => d.x,
      d => d.y
    ).voronoi([0, 0, width, height]);

    // Add the Voronoi diagram to the SVG for better mouse interaction
    svg
      .append('g')
      .selectAll('.voronoi')
      .data(allStops)
      .join('path')
      .attr('class', 'voronoi')
      .attr('d', (d, i) => voronoi.renderCell(i))
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseout', () => tooltip.style('display', 'none'))
      .on('mouseover', (event, d) => {
        // Show the tooltip on mouseover

        // console.log("d",d)

        tooltip.style('display', null);
        line1.text(`S ${d.route_id} nach ${d.trip_headsign}`);
        line2.text(`${d.stop_name}`);
        line3.text(`Ankunft: ${formatTime(d.originalArrivalTime)}`);
        line4.text(`Abfahrt: ${formatTime(d.originalDepartureTime)}`);
        const box = text.node()!.getBBox();
        path.attr(
          'd',
          `
          M${box.x - 10},${box.y - 10}
          H${box.width / 2 - 5}l5,-5l5,5
          H${box.width + 10}
          v${box.height + 20}
          h-${box.width + 20}
          z
        `
        );
        tooltip.attr(
          'transform',
          `translate(${d.x - box.width / 2},${d.y - box.height + 75})`
        );
      });
  };

  return (
    <Container maxWidth="lg">
      <div style={overlayStyles}>
        <FormControl
          sx={{ marginLeft: 1, width: '550px', alignSelf: 'center' }}
        >
          {/* <InputLabel id="demo-multiple-chip-label">Linien</InputLabel> */}
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={route}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={selected => (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  width: '100%',
                }}
              >
                {selected.map(value => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {routes.map(name => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, route, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          sx={{
            alignSelf: 'center',
            width: '120px',
            marginLeft: '10px',
            marginRight: '50px',
          }}
          control={
            <Checkbox
              checked={stations}
              onChange={handleCheckbox}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
          label="Stationen anzeigen"
        />
        <Slider
          getAriaLabel={() => 'Time range'}
          value={tempTimeRange}
          onChange={(event, newValue) => {
            setTempTimeRange(newValue);
          }}
          onChangeCommitted={handleSliderChangeCommitted}
          valueLabelDisplay="auto"
          min={0}
          max={24}
          marks={marks}
          step={0.5}
          sx={{ width: '600px', alignSelf: 'center' }}
          valueLabelFormat={value => {
            const hours = Math.floor(value);
            const minutes = (value - hours) * 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          }}
        />
      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg ref={svgRef}></svg>
      </Box>
    </Container>
  );
};

export default TrainScheduleChart;
