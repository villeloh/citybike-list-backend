const express = require('express');
const app = express();
const port = 3000;
const { createAndPopulateDb } = require('./db/utils/dbInit');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  createAndPopulateDb();
});