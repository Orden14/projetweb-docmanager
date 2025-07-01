import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '@prisma/client';

describe('UserResolver', () => {
    let resolver: UserResolver;

    const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: Role.USER,
    };

    const mockCreateUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: Role.USER
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserResolver,
                {
                    provide: UserService,
                    useValue: {
                        findAllUser: jest.fn().mockResolvedValue([mockUser]),
                        findUser: jest.fn().mockResolvedValue(mockUser),
                        createUser: jest.fn().mockResolvedValue(mockUser)
                    }
                }
            ]
        }).compile();

        resolver = module.get<UserResolver>(UserResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('findAllUsers', () => {
        it('should return an array of users', async () => {
            const result = await resolver.findAllUsers();
            expect(result).toEqual([mockUser]);
        });
    });

    describe('getUserById', () => {
        it('should return a single user', async () => {
            const result = await resolver.getUserById('1');
            expect(result).toEqual(mockUser);
        });
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const result = await resolver.createUser(mockCreateUserDto);
            expect(result).toEqual(mockUser);
        });
    });
});
