import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class AppController {
    static getStatus(request, response) {
        const redis = redisClient.isAlive();
        const db = dbClient.isAlive();
        response.status(200).json({ "redis": redis, "db": db });
    }

    static getStats(request, response) {
        const users = dbClient.nbUsers();
        const files = dbClient.nbFiles();
        response.status(200).json({ "users": users, "files": files })
    }
}
