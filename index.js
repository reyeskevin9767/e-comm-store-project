//* Creates web server
const express = require('express');

const bodyParser = require('body-parser');
const app = express();

//* All router handles will use middleware to parse data
app.use(bodyParser.urlencoded({ extended: true }));

//* Route Handler - Get Request
// POST configs form for the browser
// to send a post request will all the data
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

//* Route Handler - Post Request
// All the data is store in req.body
app.post('/', (req, res) => {
  console.log(req.body);
  res.send(`Account Created`);
});

//* Start up server
app.listen(3000, () => {
  console.log('Listening');
});

//* NOT MEANT FOR PRODUCTION USE
//* Express Server -> Data Store(users, products) -> Hard Drive (products, users)
//* Problems with using storing data on hard drive
//* Will error if we try to open/write to the same file twice at the same time
//* Won't work if we have multiple servers running on different machines
//* We have to write to the File System every time we want to update some data
