const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = +(process.env.DB_PORT) || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/${dbName}`;

class DBClient {
  constructor() {
    // envLoader();
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      console.log(this.client.isConnected());
      this.db = this.client.db(dbName);
    }).catch((err) => {
      console.log(err);
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }
}

module.exports = new DBClient();
