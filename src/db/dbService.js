
// Adapted from: https://medium.com/swlh/reading-large-structured-text-files-in-node-js-7c4c4b84332b
// NOTE: This is not the fastest solution, but that would've beeen considerably less clear; the trade-off was not worth it, 
// as data will only be entered into the db as huge chunks one time initially, and later on only incrementally (via API calls).

const { DB_NAME, DB_URL, MIN_TRIP_DISTANCE_M, MIN_TRIP_DURATION_S, STATION_DATA_FILEPATH, TRIP_DATA_FILEPATHS, DB_COLUMN_NAME_STATIONS, DB_COLUMN_NAME_TRIPS } = require('../../constants');
const { Station, Trip, GeoLocation } = require('../model');

const { MongoClient } = require('mongodb');
const client = new MongoClient(DB_URL);

// Create database ==================================================

const createDatabase = async () => {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to Mongo client.');
  const db = client.db(DB_NAME);
  // db.collection('stations'); // creates it if it doesn't exist
  // db.collection('trips');

  return 'Finished creating database.';
};

const createDbIfNotExist = async () => {

  createDatabase()  
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
};

const connectedDatabase = async () => {

  await client.connect();
  console.log('Connected successfully to Mongo client.');
  return client.db(DB_NAME);
};

const closeDbConnection = () => {

  client.close();
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
  if (collectionExists(await connectedDatabase(), DB_COLUMN_NAME_STATIONS)) {

    closeDbConnection();
    return;
  }

  const rlInterface = readLineInterface(STATION_DATA_FILEPATH);

  for await (const line of rlInterface) {

    const data = parseLine(line);

    // field #0 contains line number (not needed)
    const station = new Station(
      Number(data[1]), // unique stationId
      data[2], // name in Finnish
      data[3], // name in Swedish
      data[4], // name in English
      data[5] +', ' + data[7], // address (street + city) in Finnish
      data[6] + ', ' + data[8], // address (street + city) in Swedish
      data[9], // bike service operator
      Number(data[10]), // bike capacity
      new GeoLocation(Number(data[11]), Number(data[12])) // x & y coordinates
    );
    
  }
};

const addAllTripsToDb = async () => {

  // a bit clumsy, but this way we'll only add the data once
  if (collectionExists(await connectedDatabase(), DB_COLUMN_NAME_TRIPS)) {

    closeDbConnection();
    return;
  }

  TRIP_DATA_FILEPATHS.forEach(async (filePath) => {

    const rlInterface = readLineInterface(filePath);

    for await (const line  of rlInterface) {

      const data = parseLine(line);

      const trip = new Trip(
        new Date(data[0]), // dep. time
        new Date(data[1]), // ret. time
        Number(data[2]), // dep. stationId
        data[3], // dep. station name
        Number(data[4]), // ret. stationId
        data[5], // ret. station name
        Number(data[6]), // distance
        Number(data[7]) // duration
      );

      if (validTrip(trip)) {

      } else { 
        continue; 
      }
    }
  });
};

const validTrip = (trip) => {
  return trip.distance > MIN_TRIP_DISTANCE_M && trip.duration > MIN_TRIP_DURATION_S;
};

exports.createAndPopulateDb = async () => {

  await createDbIfNotExist();
  addAllStationsToDb();
  addAllTripsToDb();
};