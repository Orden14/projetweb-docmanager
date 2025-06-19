import { Controller, Get } from '@nestjs/common';
import { BullMqService } from '../queues/bullmq.service';

@Controller('health')
export class HealthController {
    constructor(private readonly bullService: BullMqService) {}

    @Get()
    async getHealth(): Promise<string> {
        await this.bullService.addJob({ timestamp: new Date().toISOString() });
        return 'OK';
    }
}
