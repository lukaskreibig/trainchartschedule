export interface ITrip {
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

export interface IStop {
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

export interface IData {
  trips: ITrip[];
  stops: IStop[];
  stoptimes: IStopTime[];
}

export interface IProcessedData {
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

export interface IProcessedStop {
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

export interface ID3Point {
  stop_name: string | null;
  time?: Date;
}
