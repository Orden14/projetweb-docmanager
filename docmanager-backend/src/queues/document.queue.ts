import {Queue} from 'bullmq';
import {Injectable, Logger} from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DocumentQueueService {
    private readonly queue: Queue;
    private readonly logger = new Logger(DocumentQueueService.name);

    constructor() {
        this.queue = new Queue('documentQueue', {
            connection: { url: process.env.REDIS_URL || 'redis://redis:6379' }
        });
    }

    async addJob(name: string, data: any) {
        await this.queue.add(name, data);
        this.logger.log(`Job added: ${name}`);
    }
}
