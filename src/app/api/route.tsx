// pages/api/importGtfs.js
import {
  getCalendars,
  getRoutes,
  getStops,
  getStoptimes,
  getTrips,
  importGtfs,
} from 'gtfs';
import { NextResponse } from 'next/server';

const db = require('better-sqlite3')('gtfs-data.db', { verbose: console.log });
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

  // const routes = getRoutes();
  // console.log("routes", routes)
  const stops = getStops();
  console.log('stops', stops);
  const trips = getTrips();
  console.log('trips', trips);
  const stoptimes = getStoptimes();
  console.log('stoptimes', stoptimes);
  const calendars = getCalendars();
  console.log('calendars', calendars);

  return NextResponse.json({ stops, trips, stoptimes, calendars });
}
