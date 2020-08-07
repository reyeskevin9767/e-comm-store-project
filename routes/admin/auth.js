const express = require('express');
const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
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
  handleErrors(signupTemplate),
  async (req, res) => {
    // All the data is store in req.body
    const { email, password } = req.body;

    // Create A User
    const user = await usersRepo.create({ email, password });

    // Store the user's id in users cookie
    req.session.userId = user.id;

    res.redirect('/admin/products');
  }
);

//* Get Route - Signout
router.get('/signout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

//* Get Route - Signin
router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

//* Post Route - Signin
router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;

    // Find the user
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect('/admin/products');
  }
);

module.exports = router;
