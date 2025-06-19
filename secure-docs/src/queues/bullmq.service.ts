import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class BullMqService implements OnModuleInit {
    private connection: Redis;
    private queue: Queue;

    onModuleInit() {
        this.connection = new IORedis();
        this.queue = new Queue('document-queue', { connection: this.connection });
    }

    async addJob(data: Record<string, any>) {
        await this.queue.add('process', data);
    }
}
