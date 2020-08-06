const fs = require('fs');
const crypto = require('crypto');
const { timeStamp } = require('console');

//* Shorthand functions are methods

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

    // Store all file contents
    const records = await this.getAll();
    records.push(attrs);

    // Update JSON file
    await this.writeAll(records);
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

  // Create random id for new user
  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }
}

const test = async () => {
  const repo = new UserRepository('users.json');

  await repo.update('fd7aadfa6eea', { password: 'password' });
};

test();
