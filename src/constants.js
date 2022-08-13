
exports.DB_NAME = 'citybikeDb';
exports.DB_URL = 'mongodb://localhost:27017';
exports.STATION_DATA_FILEPATH = './csv/Stations.csv';
exports.TRIP_DATA_FILEPATHS = ['./csv/Trips-2021-05.csv' , './csv/Trips-2021-06.csv', './csv/Trips-2021-07.csv'];
exports.DB_COLL_NAME_STATIONS = 'STATIONS';
exports.DB_COLL_NAME_TRIPS = 'TRIPS';
exports.MIN_TRIP_DISTANCE_M = 100;
exports.MIN_TRIP_DURATION_S = 10;

exports.SERVER_PORT_NUMBER = 3000;

exports.STATIONS_URL = '/stations';
exports.TRIPS_URL = '/trips';
exports.STATION_URL = '/station';
exports.TRIP_URL = '/trip';

exports.DEFAULT_STATION_PAGE_LIMIT = 20;
exports.DEFAULT_TRIP_PAGE_LIMIT = 20;

exports.TRIP_ORDER = {
  default: {},
  dep_from_asc: { depStation: 1 },
  ret_to_asc: { retStation: 1 },
  distance_asc: { distance: 1 },
  duration_asc: { duration: 1 },
  dep_from_desc: { depStation: -1 },
  ret_to_desc: { retStation: -1 },
  distance_desc: { distance: -1 },
  duration_desc: { duration: -1 }
};