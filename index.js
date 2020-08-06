//* Create a web server
const express = require('express');
const app = express();

//* Get Route - Home
app.get('/', (req, res) => {
  res.send('Hi There');
});

//* Start up server
app.listen(3000, () => {
  console.log('Listening');
});
