import {
  getCalendars,
  getStops,
  getStoptimes,
  getTrips,
  importGtfs,
} from 'gtfs';
import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('gtfs-data.db', { verbose: console.log });
db.pragma('journal_mode = WAL');

const config = {
  agencies: [
    {
      path: 'src/app/api/gtfs/',
      exclude: ['translations'],
    },
  ],
};

export async function POST() {
  await importGtfs(config);

  const stops = getStops();
  const trips = getTrips();
  const stoptimes = getStoptimes();
  const calendars = getCalendars();

  return NextResponse.json({ stops, trips, stoptimes, calendars });
}
