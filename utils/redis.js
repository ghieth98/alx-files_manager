import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    // Handle Errors
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
  }

  isAlive() {
    // Attempt to connect to Redis
    return this.client.connected;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else if (value === null) {
          // Key doesn't exist or has expired
          resolve(null);
        } else {
          resolve(value);
        }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, resp) => {
        if (err) reject(err);
        resolve(resp === true);
      });
    });
  }
}

const redisClient = new RedisClient();
export default redisClient;
