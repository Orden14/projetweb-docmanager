import {Test, TestingModule} from '@nestjs/testing';
import {HealthController} from './health.controller';
import {DocumentQueueService} from '../queues/document.queue';

describe('HealthController', () => {
    let healthController: HealthController;

    const mockDocumentQueueService = {
        addJob: jest.fn().mockResolvedValue(null),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: DocumentQueueService,
                    useValue: mockDocumentQueueService,
                },
            ],
        }).compile();

        healthController = module.get<HealthController>(HealthController);
    });

    it('should be defined', () => {
        expect(healthController).toBeDefined();
    });

    it('should return OK on healthCheck', async () => {
        const result = await healthController.healthCheck();
        expect(result).toBe('OK');
        expect(mockDocumentQueueService.addJob).toHaveBeenCalledWith(
            'healthCheck',
            {
                message: 'Health check job',
            },
        );
    });
});
