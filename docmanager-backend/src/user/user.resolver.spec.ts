import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { Queue } from 'bullmq';
import { UserJobName } from '../enum/user.job.enum';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';


jest.mock('../auth/auth.guard', () => ({
    AuthGuard: jest.fn().mockImplementation(() => ({
        canActivate: jest.fn().mockReturnValue(true),
    })),
}));
jest.mock('../guards/admin.guard', () => ({
    AdminGuard: jest.fn().mockImplementation(() => ({
        canActivate: jest.fn().mockReturnValue(true),
    })),
}));

describe('UserResolver', () => {
    let resolver: UserResolver;
    let userQueue: Queue;

    beforeEach(async () => {
        const mockQueue = {
            add: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserResolver,
                {
                    provide: UserService,
                    useValue: {
                        createUser: jest.fn(),
                        findAllUser: jest.fn(),
                        findUser: jest.fn(),
                    },
                },
                {
                    provide: 'BullQueue_user',
                    useValue: mockQueue,
                },
            ],
        }).compile();

        resolver = module.get<UserResolver>(UserResolver);
        userQueue = module.get<Queue>('BullQueue_user');
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('findAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [{ id: '1', name: 'John Doe' }];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            jest.spyOn(userQueue, 'add').mockResolvedValue({
                waitUntilFinished: jest.fn().mockResolvedValue(mockUsers),
            } as any);

            const result = await resolver.findAllUsers();
            expect(result).toEqual(mockUsers);
            expect(userQueue.add).toHaveBeenCalledWith(
                UserJobName.FindAllUsers,
                {},
            );
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            const mockUser = { id: '1', name: 'John Doe' };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            jest.spyOn(userQueue, 'add').mockResolvedValue({
                waitUntilFinished: jest.fn().mockResolvedValue(mockUser),
            } as any);

            const result = await resolver.getUserById('1');
            expect(result).toEqual(mockUser);
            expect(userQueue.add).toHaveBeenCalledWith(
                UserJobName.FindUserById,
                { id: '1' },
            );
        });
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const createUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: Role.USER,
            };

            const mockUser = { id: '1', ...createUserDto };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            jest.spyOn(userQueue, 'add').mockResolvedValue({
                waitUntilFinished: jest.fn().mockResolvedValue(mockUser),
            } as any);

            const result = await resolver.createUser(createUserDto);
            expect(result).toEqual(mockUser);
            expect(userQueue.add).toHaveBeenCalledWith(
                UserJobName.CreateUser,
                createUserDto,
            );
        });
    });
});
