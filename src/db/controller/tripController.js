const { DB_COLL_NAME_TRIPS } = require('../../constants');
const dbService = require('../dbService');

exports.getTrips = async (skip, limit, options) => {

  // empty query object returns every Trip
  return await dbService.getMany(DB_COLL_NAME_TRIPS, {}, options, skip, limit);
};

// Not sure if needed; disabling for now.
// id is the one that Mongo gives to it
/* exports.getTrip = (id) => {

}; */

exports.addTrip = async (trip) => {

  if (dbService.validTrip(trip)) {

    await dbService.addOne(DB_COLL_NAME_TRIPS, trip);
  } else {
    console.log('Invalid trip; aborting db insert.');
  }
};

exports.deleteTrip = (id) => {

  const query = { id };

  await dbService.deleteOne(DB_COLL_NAME_TRIPS, query);
};
