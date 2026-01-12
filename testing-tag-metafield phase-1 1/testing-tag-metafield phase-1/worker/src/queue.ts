import { Queue, Worker, type ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';

// Redis connection options
const connection: ConnectionOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};

// Create a Redis instance for general use (like logging)
export const redis = new IORedis(connection as any);

redis.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
});

// Queue name
export const QUEUE_NAME = 'test-worker-queue';

// Create the queue instance (for enqueuing jobs)
export const testQueue = new Queue(QUEUE_NAME, { connection });

// Helper to create a worker
export const createWorker = (processor: any) => {
    return new Worker(QUEUE_NAME, processor, { connection });
};
