const fs = require('fs');
const { text } = require('express');

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
    // Open the file
    const contents = await fs.promises.readFile(this.filename, {
      encoding: 'utf8',
    });

    //read its contents
    console.log(contents);

    // parse the contents

    //return the parsed data
  }
}

const test = async () => {
  const repo = new UserRepository('users.json');

  await repo.getAll();
};

test();
