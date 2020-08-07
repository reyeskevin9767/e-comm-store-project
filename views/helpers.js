module.exports = {
  //* Find the msg from errors at given property
  getError(errors, prop) {
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      return '';
    }
  },
};
