//* Creates web server
const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repository/users');

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
        <input name="email" placeholder="email" />
        <input name= "password" placeholder="password" />
        <input name= "passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

//* Route Handler - Post Request
// All the data is store in req.body
app.post('/', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send('Email in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Password must match');
  }

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
