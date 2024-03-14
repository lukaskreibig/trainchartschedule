// pages/api/importGtfs.js
import {
  getCalendars,
  getStops,
  getStoptimes,
  getTrips,
  importGtfs,
} from 'gtfs';
import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const tmpDir = '/tmp';

const db = new Database('/tmp/gtfs-data.db', { verbose: console.log });
db.pragma('journal_mode = WAL');

const config = {
  sqlitePath: 'tmp/gtfs-data.db',
  agencies: [
    {
      path: 'src/app/api/gtfs/',
      exclude: ['translations'],
    },
  ],
};

export async function POST() {
  await importGtfs(config);

  // const routes = getRoutes();
  // console.log("routes", routes)
  const stops = getStops();
  const trips = getTrips();
  const stoptimes = getStoptimes();
  const calendars = getCalendars();

  return NextResponse.json({ stops, trips, stoptimes, calendars });
}
