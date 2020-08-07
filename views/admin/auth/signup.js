//* Basic html layout
const layout = require('../layout');

//* Find the msg from errors at given property
const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (err) {
    return '';
  }
};

//* HTML of signup
module.exports = ({ req, errors }) => {
  return layout({
    content: `
  <div>
  Your id is ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email" />
      ${getError(errors, 'email')}
      <input name= "password" placeholder="password" />
      ${getError(errors, 'password')}
      <input name= "passwordConfirmation" placeholder="password confirmation" />
      ${getError(errors, 'passwordConfirmation')}
      <button>Sign Up</button>
    </form>
  </div>
  `,
  });
};
