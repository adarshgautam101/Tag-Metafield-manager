import { createWorker } from './queue';
import { processJob } from './processor';

console.log('🚀 Worker starting...');

const worker = createWorker(processJob);

worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`❌ Job ${job?.id} has failed with ${err.message}`);
});

console.log('👀 Worker listening for jobs...');
