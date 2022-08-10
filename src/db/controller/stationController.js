const { DB_COLL_NAME_STATIONS } = require('../../constants');
const dbService = require('../dbService');

exports.getStations = async (skip, limit) => {
  
  return await dbService.getMany(DB_COLL_NAME_STATIONS, {}, {}, skip, limit);
};

exports.getStation = async (stationId) => {

  const query = { stationId };

  return await dbService.getOne(DB_COLL_NAME_STATIONS, query);
};

exports.addStation = async (station) => {

  await dbService.addOne(DB_COLL_NAME_STATIONS, station);
};

exports.deleteStation = async (stationId) => {

  const query = { stationId };

  await dbService.deleteOne(DB_COLL_NAME_STATIONS, query);
};
