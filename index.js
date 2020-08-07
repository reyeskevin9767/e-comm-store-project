//* Creates web server
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repository/users');
const { urlencoded } = require('express');
const { comparePasswords } = require('./repository/users');

const app = express();

//* All router handles will use middleware to parse data
app.use(bodyParser.urlencoded({ extended: true }));

//* Use cookies to have unique users
app.use(
  cookieSession({
    keys: ['adfd2342f323243dsfay789784r2d'],
  })
);

//* Route Handler - Get Request
// POST configs form for the browser
// to send a post request will all the data
app.get('/signup', (req, res) => {
  res.send(`
    <div>
    Your id is ${req.session.userId}
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
app.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send('Email in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Password must match');
  }

  // Create A User
  const user = await usersRepo.create({ email, password });

  // Store the user's id in users cookie
  req.session.userId = user.id;

  res.send(`Account Created`);
});

//* Get Request
// Sign user out
app.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

//* Get Request
// Use sign in
app.get('/signin', (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name= "password" placeholder="password" />
      <button>Sign In</button>
    </form>
  </div>
  `);
});

//* Post Request
// Processes user signin form
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send('Email Not Found');
  }

  const validPassword = await comparePasswords(user.password, password);

  if (!validPassword) {
    return res.send('Invalid Password');
  }

  req.session.userId = user.id;

  res.send('You are signed in!!!');
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
