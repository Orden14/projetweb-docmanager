import {Controller, Get} from '@nestjs/common';
import {DocumentQueueService} from '../queues/document.queue';

@Controller('health')
export class HealthController {
    constructor(private readonly documentQueueService: DocumentQueueService) {
    }

    @Get()
    async healthCheck(): Promise<string> {
        await this.documentQueueService.addJob('healthCheck', {
            message: 'Health check job',
        });

        return 'OK';
    }
}
