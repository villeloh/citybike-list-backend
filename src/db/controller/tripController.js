const { DB_COLL_NAME_TRIPS, TRIP_ORDER } = require('../../constants');
const dbService = require('../dbService');

exports.getTrips = async (skip, limit, orderStr) => {

  // MongoDB required format. Breaks separation of concerns, but I'd rather do it like this 
  // than add variant methods in dbService.
  const options = { sort: TRIP_ORDER[orderStr] };

  // empty query object returns every Trip
  return await dbService.getMany(DB_COLL_NAME_TRIPS, {}, options, skip, limit);
};

exports.addTrip = async (trip) => {

  if (dbService.validTrip(trip)) {

    return await dbService.addOne(DB_COLL_NAME_TRIPS, trip);
  } else {
    console.log('Invalid trip; aborting db insert.');
    return null;
  }
};

exports.deleteTrip = async (tripId) => {

   // MongoDB-assigned id
  const query = { _id: tripId };

  return await dbService.deleteOne(DB_COLL_NAME_TRIPS, query);
};
