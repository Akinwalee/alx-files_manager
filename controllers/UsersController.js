import dbClient from '../utils/db.js';
import crypto from 'crypto';

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        try {
            const usersCollection = dbClient.nbUsers();

            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Already exist' });
            }

            const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

            const result = await usersCollection.insertOne({
                email,
                password: hashedPassword,
            });

            return res.status(201).json({
                id: result.insertedId,
                email,
            });
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getMe(req, res) {
        const token = req.headers['X-token'];

        if (!token) {
            return res.status(401).json({error: 'Unauthorized'});
        }

        try {
            const key = `auth_${token}`;

            const userId = await redisClient.get(key);
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const user = await dbClient.nbUsers();

            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            return res.status(200).json({ id: user._id.toString() });
        } catch (err) {
            console.error('Error in getMe:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default UsersController;
