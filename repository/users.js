const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

// Developer Note: Shorthand functions are methods

// Returns a promise
const scrypt = util.promisify(crypto.scrypt);

class UserRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repository requires a filename');
    }

    this.filename = filename;

    // Wait for node to access file or create file, only
    // constructors cannot be async
    try {
      fs.accessSync(this.filename);
    } catch {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  // Get all users in file
  async getAll() {
    // Open the file and parse into json file
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    );
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

  // Update file with new records
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  // Find one user by id
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  // Delete user
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  // Update user
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    // Copy attrs to record
    Object.assign(record, attrs);

    await this.writeAll(records);
  }

  // Filters through users
  async getOneBy(filters) {
    const records = await this.getAll();

    // Loop through all users
    for (let record of records) {
      let found = true;

      // Compare filters with user data
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      // Return record that matches filter
      if (found) {
        return record;
      }
    }
  }

  // Create random id for new user
  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }
}

//* Receive an instance of UsersRepository
module.exports = new UserRepository('users.json');
