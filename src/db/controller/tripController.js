const { DB_COLL_NAME_TRIPS } = require('../../constants');
const dbService = require('../dbService');

exports.getTrips = async (skip, limit, options) => {

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

   // MongoDB-assigned id. Breaks separation of concerns, but I don't see an easy way around it.
  const query = { _id: tripId };

  return await dbService.deleteOne(DB_COLL_NAME_TRIPS, query);
};
