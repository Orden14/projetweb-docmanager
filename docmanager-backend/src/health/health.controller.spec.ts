import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';

describe('HealthController', () => {
    let healthController: HealthController;
    let healthQueue: Queue;

    beforeEach(async () => {
        const mockQueue = {
            add: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: getQueueToken('health'),
                    useValue: mockQueue,
                },
            ],
        }).compile();

        healthController = module.get<HealthController>(HealthController);
        healthQueue = module.get<Queue>(getQueueToken('health'));
    });

    it('should be defined', () => {
        expect(healthController).toBeDefined();
    });

    it('should add a health-check job to the queue and return OK', async () => {
        const result = await healthController.getHealth();
        expect(healthQueue.add).toHaveBeenCalledWith('health-check', {});
        expect(result).toBe('OK');
    });
});
