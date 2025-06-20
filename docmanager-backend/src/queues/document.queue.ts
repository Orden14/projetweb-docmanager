import {Queue} from 'bullmq';
import {Injectable} from '@nestjs/common';
import {Logger} from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

const host: string = process.env.REDIS_HOST || 'localhost';
const port: number = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;

const redisConfig = {
    host: host,
    port: port,
};

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
