import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
    'document-queue',
    async job => {
        console.log(`Traitement du job :`, job.name, job.data);
    },
    { connection },
);

worker.on('completed', job => {
    console.log(`Job ${job.id} complété`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} échoué :`, err);
});
