import { Controller, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Controller('health')
export class HealthController {
    constructor(@InjectQueue('documentQueue') private readonly queue: Queue) {}

    @Get()
    async checkHealth(): Promise<string> {
        await this.queue.add('healthCheckJob', { timestamp: Date.now() });
        return 'OK';
    }
}
