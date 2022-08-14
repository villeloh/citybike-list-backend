
// Populating the db was adapted from: https://medium.com/swlh/reading-large-structured-text-files-in-node-js-7c4c4b84332b
// NOTE: This is not the fastest solution, but that would've been considerably less clear; the trade-off was not worth it, 
// as data will only be entered into the db as huge chunks one time initially, and later on only incrementally (via API calls).

const { 
  DB_NAME, 
  DB_URL, 
  MIN_TRIP_DISTANCE_M, 
  MIN_TRIP_DURATION_S, 
  STATION_DATA_FILEPATH, 
  TRIP_DATA_FILEPATHS, 
  DB_COLL_NAME_STATIONS, 
  DB_COLL_NAME_TRIPS 
} = require('../constants');
const Trip = require('../db/model/Trip');
const Station = require('../db/model/Station');
const GeoLocation = require('../db/model/GeoLocation');

const { MongoClient } = require('mongodb');
const client = new MongoClient(DB_URL);
client.connect();

// wrapper for error handling
const dbOperation = async (callback) => {
  try {
    return await callback(client.db(DB_NAME));
  } catch(error) {
    console.error(error);
    return null;
  }
};

// Create & populate db ======================================================

const collectionExists = async (database, colName) => {

  // probably horribly inefficient (if it really finds everything when the collection exists; not sure),
  // but I had to use this as I was running out of time and my original method to verify the existence didn't work.
  return await database.collection(colName).find({}).hasNext();
};

const parseLine = (line) => {
    return line.split(',');
};
  
const fs = require('fs');
const readline = require('readline');

const lineReader = (csvFilePath) => {

  const readStream = fs.createReadStream(csvFilePath);
  const rlInterface = readline.createInterface({ input: readStream });

   // Clear the first line to remove the legend... In theory. 
   // Doesn't work for God knows what reason.
  rlInterface.clearLine(readStream, 0);
  return rlInterface;
};

const addAllStationsToDb = async (db) => {

  // a bit clumsy, but this way we'll only add the data once
  if (await collectionExists(db, DB_COLL_NAME_STATIONS)) {
    return;
  }

  const rlInterface = lineReader(STATION_DATA_FILEPATH);

  for await (const line of rlInterface) {

    const data = parseLine(line);

     // skip the legend (in a way that works)
    if (data[1] === 'ID') continue; 

    // field #0 contains line number (not needed)
    const station = new Station(
      parseInt(data[1]), // unique stationId
      data[2], // name in Finnish
      data[3], // name in Swedish
      data[4], // name in English
      data[5] +', ' + data[7], // address (street + city) in Finnish
      data[6] + ', ' + data[8], // address (street + city) in Swedish
      data[9], // bike service operator
      parseInt(data[10]), // bike capacity
      new GeoLocation(Number(data[11]), Number(data[12])) // x & y coordinates
    );
    await db.collection(DB_COLL_NAME_STATIONS).insertOne(station);
  }
};

const addAllTripsToDb = async (db) => {

  // a bit clumsy, but this way we'll only add the data once
  if (await collectionExists(db, DB_COLL_NAME_TRIPS)) {
    return;
  }

  // foreach crashed due to running out of memory
  for (let i = 0; i < TRIP_DATA_FILEPATHS.length; i++) {

    const filePath = TRIP_DATA_FILEPATHS[i];
    const rlInterface = lineReader(filePath);

    for await (const line of rlInterface) {

      const data = parseLine(line);

      const trip = new Trip(
        new Date(data[0]), // dep. time
        new Date(data[1]), // ret. time
        parseInt(data[2]), // dep. stationId
        data[3], // dep. station name
        parseInt(data[4]), // ret. stationId
        data[5], // ret. station name
        parseInt(data[6]), // distance
        parseInt(data[7]) // duration
      );

      if (validTrip(trip)) {
        await db.collection(DB_COLL_NAME_TRIPS).insertOne(trip);
      } else { 
        continue; 
      }
    }
  }
};

exports.validTrip = validTrip = (trip) => {
  return trip.distance > MIN_TRIP_DISTANCE_M && trip.duration > MIN_TRIP_DURATION_S;
};

exports.createAndPopulateDb = async () => {

  await dbOperation(addAllTripsToDb);
  await dbOperation(addAllStationsToDb);
};

// 'Regular' database methods, to be called by the controllers ========

exports.addOne = async (collectionName, object) => {

  if (!object) {
    console.log('Aborting; no object included in database add query.');
    return null;
  }

  return await dbOperation(async (db) => {
      return await db.collection(collectionName).insertOne(object);
  });
};

exports.getOne = async (collectionName, query) => {

  return await dbOperation(async (db) => {
    return await db.collection(collectionName).findOne(query);
  });
};

exports.getMany = async (collectionName, query, options = null, skip = 0, limit = 0) => {

  return await dbOperation(async (db) => {
    return await db.collection(collectionName).find(query, options).skip(skip).limit(limit).toArray();
  });
};

exports.deleteOne = async (collectionName, query) => {

  return await dbOperation(async (db) => {

    const result = await db.collection(collectionName).deleteOne(query);
  
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
    return { success: true };
  });
};