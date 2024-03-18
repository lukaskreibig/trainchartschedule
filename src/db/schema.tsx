import { integer, numeric, pgTable, text } from 'drizzle-orm/pg-core';

export const agencyTable = pgTable('agency', {
  agency_id: text('agency_id').primaryKey(),
  agency_name: text('agency_name').notNull(),
  agency_url: text('agency_url').notNull(),
  agency_timezone: text('agency_timezone').notNull(),
  agency_lang: text('agency_lang'),
  agency_phone: text('agency_phone'),
});

export const stopsTable = pgTable('stops', {
  stop_id: text('stop_id').primaryKey(),
  stop_code: text('stop_code'),
  stop_name: text('stop_name').notNull(),
  stop_desc: text('stop_desc'),
  stop_lat: numeric('stop_lat').notNull(),
  stop_lon: numeric('stop_lon').notNull(),
  zone_id: text('zone_id'),
  stop_url: text('stop_url'),
  location_type: integer('location_type'),
  parent_station: text('parent_station'),
});
export const routesTable = pgTable('routes', {
  route_id: text('route_id').primaryKey(),
  agency_id: text('agency_id'),
  route_short_name: text('route_short_name').notNull(),
  route_long_name: text('route_long_name'),
  route_desc: text('route_desc'),
  route_type: integer('route_type').notNull(),
  route_url: text('route_url'),
  route_color: text('route_color'),
  route_text_color: text('route_text_color'),
});

export const tripsTable = pgTable('trips', {
  trip_id: text('trip_id').primaryKey(),
  route_id: text('route_id'),
  service_id: text('service_id').notNull(),
  trip_headsign: text('trip_headsign'),
  trip_short_name: text('trip_short_name'),
  direction_id: integer('direction_id'),
  block_id: text('block_id'),
  shape_id: text('shape_id'),
  // wheelchair_accessible: integer("wheelchair_accessible"),
  // bikes_allowed: integer("bikes_allowed")
});

export const stopTimesTable = pgTable('stop_times', {
  trip_id: text('trip_id'),
  arrival_time: text('arrival_time').notNull(),
  departure_time: text('departure_time').notNull(),
  stop_id: text('stop_id').notNull(),
  stop_sequence: integer('stop_sequence').notNull(),
  stop_headsign: text('stop_headsign'),
  pickup_type: integer('pickup_type'),
  drop_off_type: integer('drop_off_type'),
  shape_dist_traveled: numeric('shape_dist_traveled'),
  // timepoint: integer("timepoint")
});

export const calendarTable = pgTable('calendar', {
  service_id: text('service_id').primaryKey(),
  monday: integer('monday').notNull(),
  tuesday: integer('tuesday').notNull(),
  wednesday: integer('wednesday').notNull(),
  thursday: integer('thursday').notNull(),
  friday: integer('friday').notNull(),
  saturday: integer('saturday').notNull(),
  sunday: integer('sunday').notNull(),
  start_date: text('start_date').notNull(),
  end_date: text('end_date').notNull(),
});
