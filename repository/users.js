const fs = require('fs');
const { text } = require('express');
const { create } = require('domain');

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

  // Get all content in file
  async getAll() {
    // Open the file and parse into json file
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    );
  }

  async create(attrs) {
    // Store all file contents
    const records = await this.getAll();
    records.push(attrs);

    // Update file with new records
    await fs.promises.writeFile(this.filename, JSON.stringify(records));
  }
}

const test = async () => {
  const repo = new UserRepository('users.json');

  await repo.create({ email: 'test@test.com', password: 'password' });

  const users = await repo.getAll();

  console.log(users);
};

test();
