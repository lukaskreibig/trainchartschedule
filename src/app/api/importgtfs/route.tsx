import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, sql } from 'drizzle-orm';
import * as schema from '../../../db/schema';
import {
  routesTable,
  stopTimesTable,
  stopsTable,
  tripsTable,
} from '../../../db/schema';
import { IStopTime } from '@/app/types';

/**
 * Connection string for the PostgreSQL database, derived from environment variables.
 * @type {string}
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// PostgreSQL client instance. Prefetch is disabled to support "Transaction" pool mode.
const client = postgres(connectionString, { prepare: false });

// Drizzle ORM database instance, configured with the PostgreSQL client and schema.
const db = drizzle(client, { schema });

/**
 * Fetches trip and stop time information from a GTFS (General Transit Feed Specification) dataset.
 * It returns trips that have at least one stop within a specified time range.
 *
 * @returns {Promise<NextResponse>} A Next.js response object containing the trips data or an error message.
 */
export async function GET() {
  try {
    // Fetch trips data
    const tripsData = await db
      .select({
        trip_id: tripsTable.trip_id,
        route_id: tripsTable.route_id,
        trip_headsign: tripsTable.trip_headsign,
        route_short_name: routesTable.route_short_name,
      })
      .from(tripsTable)
      .innerJoin(routesTable, eq(routesTable.route_id, tripsTable.route_id))
      .execute();

    // Fetch relevant stop times table and stop table in one go
    const stopTimesWithStopInfo = await db
      .select({
        trip_id: stopTimesTable.trip_id,
        stop_id: stopTimesTable.stop_id,
        arrival_time: stopTimesTable.arrival_time,
        departure_time: stopTimesTable.departure_time,
        stop_sequence: stopTimesTable.stop_sequence,
        stop_name: stopsTable.stop_name,
      })
      .from(stopTimesTable)
      .innerJoin(
        stopsTable,
        eq(sql`CAST(${stopTimesTable.stop_id} AS TEXT)`, stopsTable.stop_id)
      )
      .execute();

    // Create a map of trip_id to its stop times, assuming trip_id is always non-null
    const stopTimesMap: Record<string, IStopTime[]> = stopTimesWithStopInfo.reduce((acc, stopTime) => {
      const key = stopTime.trip_id!;
      if (!acc[key]) {
        acc[key] = [];
      }
      // @ts-expect-error
      acc[key].push(stopTime);
      return acc;
    }, {} as Record<string, IStopTime[]>);

    // Associate stop times with their respective trips and filter out trips with no stops
    const tripsWithStopTimes = tripsData
      .map(trip => ({
        ...trip,
        stops: stopTimesMap[trip.trip_id] || [],
      }))
      .filter(trip => trip.stops.length > 0);

    return Response.json({ tripsWithStopTimes }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
