const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
} = require('./validators');

// Similar to creating another app.
const router = express.Router();

//* Get Route - Signup
router.get('/signup', (req, res) => {
  // POST configs form for the browser to send a post request will all the data
  res.send(signupTemplate({ req }));
});

//* Post Route - Signup
// Sanitization then Validation
router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    // Results from validation is sent to req
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }

    // All the data is store in req.body
    const { email, password, passwordConfirmation } = req.body;

    // Create A User
    const user = await usersRepo.create({ email, password });

    // Store the user's id in users cookie
    req.session.userId = user.id;

    res.send(`Account Created`);
  }
);

//* Get Route - Signout
router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

//* Get Route - Signin
router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

//* Post Route - Signin
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
