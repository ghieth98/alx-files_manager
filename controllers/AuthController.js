import sha1 from 'sha1';
import { v4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const header = req.header('Authorization').split(' ')[1];
    const credentials = Buffer.from(header, 'base64').toString('ascii');
    const [email, encPassword] = credentials.split(':');
    if (!email || !encPassword) {
      res.status('401').json({ error: 'Unauthorized' });
      return;
    }

    const password = sha1(encPassword);
    const users = dbClient.db.collection('users');
    const user = await users.findOne({ email, password });
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = v4();
    const key = `auth_${token}`;

    await redisClient.set(key, user._id.toString(), 86400);
    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(key);
    res.status(204).send();
  }
}

module.exports = AuthController;
