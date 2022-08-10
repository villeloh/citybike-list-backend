
// Populating the db was adapted from: https://medium.com/swlh/reading-large-structured-text-files-in-node-js-7c4c4b84332b
// NOTE: This is not the fastest solution, but that would've been considerably less clear; the trade-off was not worth it, 
// as data will only be entered into the db as huge chunks one time initially, and later on only incrementally (via API calls).

const { DB_NAME, DB_URL, MIN_TRIP_DISTANCE_M, MIN_TRIP_DURATION_S, STATION_DATA_FILEPATH, TRIP_DATA_FILEPATHS, DB_COLL_NAME_STATIONS, DB_COLL_NAME_TRIPS } = require('../../constants');
const { Station, Trip, GeoLocation } = require('../model');

const { MongoClient } = require('mongodb');
const client = new MongoClient(DB_URL);

// Create database ==================================================

const createDbIfNotExist = async () => {

  try {
    await client.connect();
    console.log('Connected successfully to Mongo client.');
    client.db(DB_NAME); // creates it if it doesn't exist
    console.log('Database exists.');
  } catch(error) {
    console.error(error);
  }
  closeDbConnection();
};

const connectedDatabase = async () => {

  await client.connect();
  console.log('Connected successfully to Mongo client.');
  return client.db(DB_NAME);
};

const closeDbConnection = async () => {

  await client.close();
};

// Populate db ======================================================

const collectionExists = (database, colName) => {
  return database.listCollections({ name: colName }).hasNext();
};

const parseLine = (line) => {
    return line.split(',');
};
  
const fs = require('fs');
const readline = require('readline');

const readLineInterface = (csvFilePath) => {

  const readStream = fs.createReadStream(csvFilePath);
  const rlInterface = readline.createInterface({ input: readStream });
  readline.clearLine(readStream, 0); // clear the first line (it contains the legend for each file)
  return rlInterface;
};

const addAllStationsToDb = async () => {

  // a bit clumsy, but this way we'll only add the data once
  if (collectionExists(await connectedDatabase(), DB_COLL_NAME_STATIONS)) {

    closeDbConnection();
    return;
  }

  const db = await connectedDatabase();

  const rlInterface = readLineInterface(STATION_DATA_FILEPATH);

  for await (const line of rlInterface) {

    const data = parseLine(line);

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
      new GeoLocation(parseInt(data[11]), parseInt(data[12])) // x & y coordinates
    );
    db.collection(DB_COLL_NAME_STATIONS).insertOne(station);
  }
  closeDbConnection();
};

const addAllTripsToDb = async () => {

  // a bit clumsy, but this way we'll only add the data once
  if (collectionExists(await connectedDatabase(), DB_COLL_NAME_TRIPS)) {

    closeDbConnection();
    return;
  }

  const db = await connectedDatabase();

  TRIP_DATA_FILEPATHS.forEach(async (filePath) => {

    const rlInterface = readLineInterface(filePath);

    for await (const line  of rlInterface) {

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
        db.collection(DB_COLL_NAME_TRIPS).insertOne(trip);
      } else { 
        continue; 
      }
    }
  });
  closeDbConnection();
};

const validTrip = (trip) => {
  return trip.distance > MIN_TRIP_DISTANCE_M && trip.duration > MIN_TRIP_DURATION_S;
};

exports.createAndPopulateDb = async () => {

  await createDbIfNotExist();
  addAllStationsToDb();
  addAllTripsToDb();
};

// 'Regular' database methods, to be called by the controllers ========

exports.addOneToDb = async (collectionName, object) => {

  const db = await connectedDatabase();
  await db.collection(collectionName).insertOne(object);
  closeDbConnection();
};

exports.getOneFromDb = async (collectionName, query) => {

  const db = await connectedDatabase();
  const foundObj = await db.collection(collectionName).findOne(query);
  closeDbConnection();
  return foundObj;
};

exports.getManyFromDb = async (collectionName, query, options) => {

  const db = await connectedDatabase();
  const foundObjects = await db.collection(collectionName).find(query, options);
  closeDbConnection();
  return foundObjects.toArray();
};

exports.deleteOneFromDb = async (collectionName, query) => {

  const db = await connectedDatabase();
  const result = await db.collection(collectionName).deleteOne(query);

  if (result.deletedCount === 1) {
    console.log("Successfully deleted one document.");
  } else {
    console.log("No documents matched the query. Deleted 0 documents.");
  }
  closeDbConnection();
};