//* Create a web server
const express = require('express');
const app = express();

//* Route Handler - Get Request
// POST configs form for the browser
// Browser takes all the information
// And send a post request to the same route
app.get('/', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder ="email" />
        <input name= "password" placeholder ="password" />
        <input name= "passwordConfirmation" placeholder ="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

//* Middleware for parsing data
const bodyParser = (req, res, next) => {
  if (req.method === 'POST') {
    req.on('data', (data) => {
      const parsed = data.toString('utf8').split('&');
      const formData = {};
      for (let pair of parsed) {
        const [key, value] = pair.split('=');
        formData[key] = value;
      }
      req.body = formData;
      next();
    });
  } else {
    next();
  }
};

//* Route Handler - Post Request
// Information is stored into req.body assigned to their name attribute
app.post('/', bodyParser, (req, res) => {
  // Get Access to email, password, and password Confirmation
  console.log(req.body);
  res.send(`Account Created`);
});

//* Start up server
app.listen(3000, () => {
  console.log('Listening');
});
