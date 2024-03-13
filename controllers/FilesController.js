import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { ObjectID } from 'mongodb';
import Queue from 'bull';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const fileQueue = new Queue('fileQueue', 'redis://127.0.0.1:6379');

class FilesController {
  static async getUser(req) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const id = await redisClient.get(key);
    if (id) {
      const users = dbClient.db.collection('users');
      const ids = new ObjectID(id);
      const user = users.findOne({ _id: ids });
      if (user) return user;
      return null;
    }
    return null;
  }

  static async postUpload(req, res) {
    const user = await FilesController.getUser(req);
    // console.log(`user id  = ${userId}`);
    if (!user || user === null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name, type, parentId, data,
    } = req.body;
    const { isPublic } = req.body.isPublic || false;

    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type) return res.status(400).json({ error: 'Missing type' });
    if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });
    // console.log(user);
    const userId = user._id;
    const files = dbClient.db.collection('files');
    if (parentId) {
      const parentObject = new ObjectID(parentId);
      const parent = await files.findOne({ _id: parentObject });
      if (!parent) return res.status(400).json({ error: 'Parent not found' });
      if (parent.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }
    if (type === 'folder') {
      files.insertOne({
        name, type, parentId: parentId || 0, isPublic, userId,
      }).then((result) => {
        res.status(201).json({
          id: result.insertedId,
          userId,
          name,
          type,
          isPublic: isPublic || false,
          parentId: parentId || 0,
        });
      }).catch((error) => console.log(error));
    } else {
      const filePath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const fileName = `${filePath}/${uuidv4()}`;
      const buff = Buffer.from(data, 'base64');

      try {
        try {
          await fs.mkdir(filePath, { recursive: true });
        } catch (error) {
          console.log(error);
        }
        await fs.writeFile(fileName, buff, 'utf-8');
      } catch (error) {
        console.log(error);
      }

      files.insertOne({
        name,
        type,
        parentId: parentId || 0,
        isPublic,
        userId,
        localPath: fileName,
      }).then((result) => {
        res.status(201).json({
          id: result.insertedId,
          userId,
          name,
          type,
          isPublic: isPublic || false,
          parentId: parentId || 0,
        });

        if (type === 'image') {
          fileQueue.add({
            userId,
            fileId: result.insertedId,
          });
        }
      }).catch((error) => console.log(error));
    }
    return null;
  }
}

export default FilesController;
