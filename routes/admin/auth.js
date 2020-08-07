const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
// Similar to creating another app.
const router = express.Router();

//* Get Route - Signup
router.get('/signup', (req, res) => {
  // POST configs form for the browser 
  // to send a post request will all the data
  res.send(signupTemplate({ req }));
});

//* Post Route - Signup
router.post('/signup', async (req, res) => {
  // All the data is store in req.body
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

//* Get Route - Signout
router.get('/signout', (req, res) => {
  // Sign user out
  req.session = null;
  res.send('You are logged out');
});

//* Get Route - Signin
router.get('/signin', (req, res) => {
  // User signs in
  res.send(signinTemplate());
});

//* Post Route - Signin
// Process user signin form
router.post('/signin', async (req, res) => {
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

module.exports = router;
