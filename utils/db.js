const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = +(process.env.DB_PORT) || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.client.connect((err) => {
      if (!err) {
        console.log('connected to MongoDB Database');
        this.dbAlive = true;
      } else {
        console.error('Error connecting to MongoDB:', err.message);
        console.log('URI:', uri);
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

module.exports = new DBClient();
