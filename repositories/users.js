const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

// Developer Note: Shorthand functions are methods

// Returns a promise
const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository{
  // Compare database password to supplied password from signin
  async comparePasswords(saved, supplied) {
    const [hashed, salt] = saved.split('.');
    const hashedSupplied = await scrypt(supplied, salt, 64);

    return hashed === hashedSupplied.toString('hex');
  }

  // Create new a new user
  async create(attrs) {
    attrs.id = this.randomId();

    // Create salt and hashed password
    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64);

    // Store all file contents
    const records = await this.getAll();
    const record = { ...attrs, password: `${buf.toString('hex')}.${salt}` };
    records.push(record);

    // Update JSON file
    await this.writeAll(records);

    return record;
  }
}

//* Receive an instance of UsersRepository
module.exports = new UserRepository('users.json');
