import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ID3Point, IProcessedData } from '@/app/types';
import { CHART_HEIGHT, CHART_MARGINS, CHART_WIDTH } from '@/app/constants';
import { Box } from '@mui/material';

 /**
 * ChartProps defines the properties expected by the Chart component.
 * @prop {IProcessedData[] | null} processedData - Array of processed data objects or null.
 * @prop {boolean} stationsVisible - Determines the visibility of stations on the chart.
 */
interface ChartProps {
  processedData: IProcessedData[] | null;
  stationsVisible: boolean;
}

/**
 * The Chart component renders a D3 chart visualization based on the processed data provided.
 * It visualizes train schedules where each trip is represented as a line through its stops.
 * Stations can be toggled on or off.
 *
 * @component
 */
export const Chart: React.FC<ChartProps> = ({
  processedData,
  stationsVisible,
}) => {
  // useRef hook to reference the SVG element where the chart will be drawn.
  const svgRef = useRef<SVGSVGElement>(null);

  //useEffect hook to redraw the chart whenever the processed data or the station visibility changes.
  useEffect(() => {
    if (!processedData) {
      // Early return if there is no data to render.
      return;
    }

    // Invokes the chart drawing function.
    createChart();
  }, [processedData, stationsVisible]);

  /**
   * Creates and renders the D3 chart using SVG.
   * This function is responsible for setting up the chart's scales, axes, and lines
   * based on the processed data. It also handles the optional display of stations and
   * the setup of a tooltip for more detailed information upon hover.
   */

  const createChart = () => {
    const margin = CHART_MARGINS;
    const width = CHART_WIDTH;
    const height = CHART_HEIGHT;

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
        processedData!
          .flatMap(trip => trip.stops.map(stop => stop.stop_name))
          .filter((name): name is string => name !== null)
      )
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleTime()
      .domain(
        d3.extent(
          processedData!
            .flatMap(trip => trip.stops)
            .map(stop => stop.originalArrivalTime)
        ) as [Date, Date]
      )
      .range([0, height]);

    const xAxis = d3.axisTop(xScale);

    const xGrid = d3
      .axisTop(xScale)
      .tickSize(-height) // Use the negative height to extend the lines downward
      // @ts-expect-error
      .tickFormat('')
      .tickPadding(10)
      .tickSizeOuter(0);

    // Append the grid to the chart
    svg
      .append('g')
      .attr('class', 'x-grid')
      .attr('transform', `translate(0,0)`) // Align with the top axis
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
      .domain(processedData!.map(d => d.route_id));

    // const lineGenerator = d3.line()
    //   .x(d => xScale(d.stop_name) + xScale.bandwidth() / 2)
    //   .y(d => yScale(d.time))
    //   .curve(d3.curveMonotoneX);
    const lineGenerator = d3
      .line<ID3Point>()
      .x(d => xScale(d.stop_name!)! + xScale.bandwidth() / 2) // Ensure stop_name is not null or handle it appropriately
      .y(d => yScale(d.time!)) // ID3Point includes time, so this is valid
      .curve(d3.curveLinear);

    processedData!.forEach(trip => {
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

    processedData!.forEach(trip => {
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

    stationsVisible
      ? processedData!.forEach(trip => {
          trip.stops.forEach(stop => {
            // const circles = svg.selectAll('.stop-circle')
            svg
              .append('circle')
              // .attr('class', 'stop-circle')
              .attr(
                'cx',
                () => xScale(stop.stop_name!)! + xScale.bandwidth() / 2
              )
              .attr('cy', () => yScale(stop.originalArrivalTime))
              .attr('r', 3)
              .attr('fill', 'rgba(0,0,0,0.5)') // Use rgba for transparency
              .attr('stroke', 'white') // White color around the dot
              .attr('stroke-width', '2px'); // Width of the white stroke to create the space
          });
        })
      : null;

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

    const allStops = processedData!.flatMap(trip =>
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
  );
};

export default Chart;
