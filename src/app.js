const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { createAndPopulateDb } = require('./db/dbService');
const stationCtrl = require('./db/controller/stationController');
const tripCtrl = require('./db/controller/tripController');
const { 
  STATIONS_URL, 
  TRIPS_URL, 
  STATION_URL, 
  TRIP_URL, 
  DEFAULT_STATION_PAGE_LIMIT, 
  DEFAULT_TRIP_PAGE_LIMIT, 
  SERVER_PORT_NUMBER 
} = require('./constants');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.get(STATIONS_URL, (req, res) => {
  
  const skip = parseInt(req.query?.skip) || 0;
  const limit = parseInt(req.query?.limit) || DEFAULT_STATION_PAGE_LIMIT;
  const stations = await stationCtrl.getStations(skip, limit);

  stations 
  ? res.status(200).json(stations)
  : res.status(500).send('No stations found; internal server error or malformed query.'); 
});

app.get(TRIPS_URL, (req, res) => {

  const skip = req.query?.skip || 0;
  const limit = req.query?.limit || DEFAULT_TRIP_PAGE_LIMIT;
  const orderStr = req.query?.order || 'default';

  const trips = await tripCtrl.getTrips(skip, limit, orderStr);

  trips
  ? res.status(200).json(trips)
  : res.status(500).send('No trips found; internal server error or malformed query.');
});

app.get(STATION_URL, (req, res) => {

  const id = req.query?.stationId;

  if (id) {
    const stationInfo = await stationCtrl.getStationInfo(id);

    // two levels of if / ternary is ok; I wouldn't use more
    stationInfo
    ? res.status(200).json(stationInfo)
    : res.status(500).send('Server error! Could not retrieve station info.');
  } else {
    res.status(400).send('Query failed; missing stationId!');
  }
});

app.post(STATION_URL, (req, res) => {

  const station = JSON.parse(req.body?.station);

  if (station) {

    const success = await stationCtrl.addStation(station);

    success
    ? res.status(201).send('Success; new station added to database.')
    : res.status(500).send('Failed to add new station to database.');
  } else {
    res.status(400).send('Db add query failed; missing station object!');
  }
});

app.post(TRIP_URL, (req, res) => {

  const trip = JSON.parse(req.body?.trip);

  if (trip) {
    const success = await tripCtrl.addTrip(trip);

    success
    ? res.status(201).send('Success; new trip added to database.')
    : res.status(500).send('Failed to add new trip to database.');
  } else {
    res.status(400).send('Db add query failed; missing trip object!');
  }
});

app.delete(STATION_URL, (req, res) => {

  const id = req.query?.stationId;

  if (id) {
    const success = await stationCtrl.deleteStation(id);

    success
    ? res.status(200).send('Success; deleted station from database.')
    : res.status(500).send('Failed to delete station from database.');
  } else {
    res.status(400).send('Db delete query failed; missing stationId!');
  }
});

app.delete(TRIP_URL, (req, res) => {

  const id = req.query?.tripId;

  if (id) {
    const success = await tripCtrl.deleteTrip(id);

    success
    ? res.status(200).send('Success; deleted trip from database.')
    : res.status(500).send('Failed to delete trip from database.');
  } else {
    res.status(400).send('Db delete query failed; missing tripId!');
  }
});

app.listen(SERVER_PORT_NUMBER, () => {
  console.log(`Server listening on port ${SERVER_PORT_NUMBER}`);
  createAndPopulateDb();
});