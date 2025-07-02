import { Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('health')
export class HealthProcessor extends WorkerHost {
    private readonly logger = new Logger(HealthProcessor.name);

    async process(job: Job): Promise<void> {
        this.logger.log(`Processing job  for job ${job.id}`);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.log(`Health job for job ${job.id} completed`);
    }
}
