const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = 'localhost';
    const port = 27017;
    const database = 'files_manager';
    const uri = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.client.connect((err) => {
      if (!err) {
        // console.log('connected to mongoDB Database');
        this.dbAlive = true;
      } else {
        console.error(err.message);
        this.dbAlive = false;
      }
    });
  }

  isAlive() {
    return !!this.dbAlive;
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
