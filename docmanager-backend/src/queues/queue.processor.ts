import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';

@Processor('documentQueue')
export class QueueProcessor {
    @Process('healthCheckJob')
    async handleHealthCheckJob(job: Job): Promise<void> {
        console.log('Processing job:', job.data);
    }
}
