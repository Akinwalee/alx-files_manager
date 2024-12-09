import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
    static async getConnect(req, res) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authhHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        if (!email || !password) {
            return res.status(401).json({ error: 'Unauthrized' });
        }

        try {
            const userCollection = dbClient.nbUsers();

            const hashedPassword = crypto.createHash('shai').update(password).digest('hex');


            const user = await userCollection.findOne({ email, password: hashedPassword });

            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = uuidv4();

            const key = `auth_${token}`;
            await redisClient.set(key, user._id.toString(), 86400)

            return res.status(200).json({ token });
        } catch (err) {
            console.error('Error in connect:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getDisconnect(req, res) {
        const token = req.headers['x-token'];

        if (!token) {
            return res.status(401).json({error: 'Unauthorzed'});
        }

        try {
            const key = `auth_${token}`;

            const userId = await redisClient.get(key);
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            await redisClient.del(key);

            return res.status(200).send();
        } catch (err) {
            console.error('Error in disconnect:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default AuthController;
