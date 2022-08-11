const express = require('express');
const app = express();
const port = 3000;
const { createAndPopulateDb } = require('./db/dbService');
const { STATIONS_URL, TRIPS_URL, STATION_INFO_URL, TRIP_URL } = require('./constants');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get(STATIONS_URL, (req, res) => {
  response.send("<h1>About</h1>");
});

app.get(TRIPS_URL, (req, res) => {

});

app.get(STATION_INFO_URL, (req, res) => {

});

app.post(STATION_URL, (req, res) => {

});

app.post(TRIP_URL, (req, res) => {

});

app.delete(STATION_URL, (req, res) => {

});

app.delete(TRIP_URL, (req, res) => {
  
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  createAndPopulateDb();
});