const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  // Assign Sanitization and Validation
  // Each Validation results in a function
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must Be A Valid Email')
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });

      if (existingUser) {
        throw new Error('Email In Use');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords Must Match');
      }
      return true;
    }),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
};
