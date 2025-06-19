import {Processor, Process} from '@nestjs/bull';
import {Job} from 'bullmq';

@Processor('documentQueue')
export class QueueProcessor {
    @Process('healthCheckJob')
    async handleHealthCheckJob(job: Job): Promise<void> {
        console.log('Processing job:', job.data);
    }

    @Process('documentCreated')
    async handleDocumentCreated(job: Job): Promise<void> {
        console.log('Document created:', job.data.document);
    }

    @Process('documentDeleted')
    async handleDocumentDeleted(job: Job): Promise<void> {
        console.log('Document deleted:', job.data.document);
    }
}
