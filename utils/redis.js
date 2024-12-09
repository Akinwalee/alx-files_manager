import { createClient } from 'redis';

class RedisClient {
    constructor() {
        this.redisClient = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });

        this.redisClient.on('error', (error) => {
            console.log(error);
        })

        this.connect()
    }

    async connect() {
        try {
            await this.redisClient.connect();
            console.log('Connected to Redis successfully');
        } catch (error) {
            console.error('Error connecting to Redis:', error);
        }
    }

    isAlive() {
        try {
            return this.redisClient.isOpen;
        } catch (error) {
            return false;
        }
    };

    async get(key) {
        try {
            const val = await this.redisClient.get(key);
            return val;
        } catch (err) {
            console.error(`Error getting ${err}`);
        }
    };

    async set(key, value, duration) {
        try {
            await this.redisClient.set(key, value, { EX: duration });
        } catch (error) {
            console.error(`Error setting key "${key}": ${err}`);
        }
    };

    async del(key) {
        try {
            await this.redisClient.del(key);
        } catch {
            console.error(`Error deleting key "${key}": ${err}`);
        }
    };
}

const redisClient = new RedisClient();

export default redisClient;
