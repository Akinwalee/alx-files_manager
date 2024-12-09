import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const host = 'localhost';
        const port = 27017;
        const dbName = 'files_manager';
        const uri = `mongodb://${host}:${port}/${dbName}`;
        this.dbClient = new MongoClient(uri);
        this.connected = false;

        this.connect();
    }

    async connect() {
        try {
            await this.dbClient.connect();
            this.connected = true;
            console.log('Connected to MongoDB successfully');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    isAlive() {
        try {
            // Ping the MongoDB server
            this.dbClient.db().command({ ping: 1 });
            return true;
          } catch (error) {
            return false;
          }
    }

    async nbUsers() {
        try{
            const coll = this.dbClient.db().collection('users');
            const count = await coll.countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting users:', error);
            return 0;
        }
    }

    async nbFiles() {
        try{
            const coll = this.dbClient.db().collection('files');
            const count = await coll.countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting files:', error);
            return 0;
        }
    }
}

const dbClient = new DBClient();

export default dbClient;
