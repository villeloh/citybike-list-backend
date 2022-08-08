
// Adapted from: https://medium.com/swlh/reading-large-structured-text-files-in-node-js-7c4c4b84332b
// NOTE: This is not the fastest solution, but that would've beeen considerably less clear; the trade-off was not worth it, 
// as data will only be entered into the db as huge chunks one time initially, and later on only incrementally (via API calls).

const parseLine = (line) => {
    const data = line.split(',');
    console.log("Data: " + data[0]);
      // TODO: make an object from the data & store it in the db	
  };
  
  const fs = require('fs');
  const readline = require('readline');
  
  const readLineInterface = (csvFilePath) => {
  
    const readStream = fs.createReadStream(csvFilePath);
    return readline.createInterface({ input: readStream });
  };
  
  const addStationsToDb = async () => {
  
    const stationsDataFilePath = './csv/Stations.csv';
    const rlInterface = readLineInterface(stationsDataFilePath);
  
    for await (const line of rlInterface) {
      parseLine(line);
    }
  };
  
  const addTripsToDb = async () => {
  
    const tripDataFilePaths = ['./csv/Trips-2021-05.csv' , './csv/Trips-2021-06.csv', './csv/Trips-2021-07.csv'];
  
    tripDataFilePaths.forEach(async (filePath) => {
  
      const rlInterface = readLineInterface(filePath);
  
      for await (const line of rlInterface) {
        parseLine(line);
      }
    });
  };
  
  exports.populateDbWithCsvData = async () => {
  
    addStationsToDb();
    addTripsToDb();
  };