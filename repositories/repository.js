const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
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

  // Create new
  async create(attrs) {
    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);

    return attrs;
  }

  // Get all content in file
  async getAll() {
    // Open the file and parse into json file
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    );
  }

  // Update file with new records
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  // Find one item by id
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  // Delete item
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  // Update item
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

  // Filters through items
  async getOneBy(filters) {
    const records = await this.getAll();

    // Loop through all items
    for (let record of records) {
      let found = true;

      // Compare filters with items data
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

  // Create random id for new item
  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }
};
