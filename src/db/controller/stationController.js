const { DB_COLL_NAME_STATIONS, DB_COLL_NAME_TRIPS } = require('../../constants');
const dbService = require('../dbService');

exports.getStations = async (skip, limit) => {
  
  return await dbService.getMany(DB_COLL_NAME_STATIONS, {}, {}, skip, limit);
};

// add useful data about the station
exports.getStationInfo = async (stationId) => {

  const query = { stationId: stationId };

  const station = await dbService.getOne(DB_COLL_NAME_STATIONS, query);
  if (!station) {
    return null;
  }

  // This query is awfully slow since we go through all the Trips. Dividing it in two and creating indices for 
  // depStationId and retStationId should be possible.
  const tripsToOrFromStation = await dbService.getMany(DB_COLL_NAME_TRIPS, { $or: [{depStationId: stationId}, {retStationId: stationId} ]});

  let numOfTripsFromStation = 0;
  let numOfTripsToStation = 0;
  let totalDistOfTripsFromStation = 0;
  let totalDistOfTripsToStation = 0;

  for (let i = 0; i < tripsToOrFromStation.length; i++) {

    const trip = tripsToOrFromStation[i];

    if (trip.depStationId === stationId) {
      numOfTripsFromStation++;
      totalDistOfTripsFromStation += trip.distance;
    }
    if (trip.retStationId === stationId) {
      numOfTripsToStation++;
      totalDistOfTripsToStation += trip.distance;
    }
  }

  const averageTripDistFromStation = numOfTripsFromStation === 0 ? 0 : totalDistOfTripsFromStation / numOfTripsFromStation;
  const averageTripDistToStation = numOfTripsToStation === 0 ? 0 : totalDistOfTripsToStation / numOfTripsToStation;

  // Determining the top 5 most popular dep./ret. stations would have to be done by some kind of db query (perhaps with the aggregate syntax), 
  // but I have no time to research it now.

  return { 
    name: station.nameEnglish, 
    address: station.addressFinnish, 
    numOfTripsFrom: numOfTripsFromStation, 
    numOfTripsTo: numOfTripsToStation, 
    avgLengthOfTripFrom: averageTripDistFromStation, 
    avgLengthOfTripTo: averageTripDistToStation,
    capacity: station.capacity,
    operator: station.operator
  };
};

exports.addStation = async (station) => {

  return await dbService.addOne(DB_COLL_NAME_STATIONS, station);
};

exports.deleteStation = async (stationId) => {

  const query = { stationId };

  return await dbService.deleteOne(DB_COLL_NAME_STATIONS, query);
};
