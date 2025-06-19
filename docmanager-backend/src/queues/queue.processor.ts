import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import {Document} from "../entities/document.entity";

interface DocumentJobData {
    document: Document;
}

@Processor('documentQueue')
export class QueueProcessor {
    @Process('healthCheckJob')
    handleHealthCheckJob(job: Job): void {
        console.log('Processing job:', job.data);
    }

    @Process('documentCreated')
    handleDocumentCreated(job: Job<DocumentJobData>): void {
        console.log('Document created:', job.data.document);
    }

    @Process('documentDeleted')
    handleDocumentDeleted(job: Job<DocumentJobData>): void {
        console.log('Document deleted:', job.data.document);
    }
}
