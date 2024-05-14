import { env } from 'process';
import { MongoClient, ObjectId } from 'mongodb';

export class DBClient {
  constructor() {
    const host = env.DB_HOST || '127.0.0.1';
    const port = env.DB_PORT || 27017;
    const database = env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;
    
    this.myClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.myClient.connect();
  }

  isAlive() {
    return this.myClient.isConnected();
  }

  async nbUsers() {
    const db = this.myClient.db();
    const collection = db.collection('users');
    return collection.countDocuments();
  }

  async nbFiles() {
    const db = this.myClient.db();
    const collection = db.collection('files');
    return collection.countDocuments();
  }

  async userExists(email) {
    const db = this.myClient.db();
    const collection = db.collection('users');
    return collection.findOne({ email });
  }

  async newUser(email, passwordHash) {
    const db = this.myClient.db();
    const collection = db.collection('users');
    return collection.insertOne({ email, passwordHash });
  }

  async filterUser(filters) {
    const db = this.myClient.db();
    const collection = db.collection('users');
    if (filters._id) {
      filters._id = ObjectId(filters._id);
    }
    return collection.findOne(filters);
  }

  async filterFiles(filters) {
    const db = this.myClient.db();
    const collection = db.collection('files');
    ['_id', 'userId', 'parentId'].forEach((prop) => {
      if (filters[prop] && filters[prop] !== '0') {
        filters[prop] = ObjectId(filters[prop]);
      }
    });
    return collection.findOne(filters);
  }
}

const dbClient = new DBClient();
export default dbClient;

