import * as redis from 'redis';

const redis_port = process.env.REDIS_PORT || 6379;

// redis client
const redisClient = redis.createClient(redis_port);

console.log("Redis ======================================================")

export { redisClient }