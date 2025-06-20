import {Queue} from 'bullmq';
import {Injectable} from '@nestjs/common';
import {Logger} from '@nestjs/common';

const redisConfig = {host: 'localhost', port: 6379};

@Injectable()
export class DocumentQueueService {
    private readonly queue: Queue;
    private readonly logger = new Logger(DocumentQueueService.name);

    constructor() {
        this.queue = new Queue('documentQueue', {connection: redisConfig});
    }

    async addJob(name: string, data: any) {
        await this.queue.add(name, data);
        this.logger.log(`Job added: ${name}`);
    }
}
