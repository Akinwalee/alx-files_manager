import dbClient from '../utils/db.js';
import crypto from 'crypto';

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        if (!email) {
            res.status(400).json({ error: 'Missing email' });
            return;
        }

        if (!password) {
            res.status(400).json({ error: 'Missing password' });
            return;
        }

        try {
            const usersCollection = dbClient.nbUsers();

            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                res.status(400).json({ error: 'Already exist' });
                return;
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
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default UsersController;
