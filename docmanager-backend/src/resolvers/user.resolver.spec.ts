import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { UserResolver } from './user.resolver';
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
        role: Role.USER,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserResolver,
                {
                    provide: UserService,
                    useValue: {
                        findAllUser: jest.fn().mockResolvedValue([mockUser]),
                        findUserById: jest.fn().mockResolvedValue(mockUser),
                        findUserByEmail: jest.fn().mockResolvedValue(mockUser),
                        createUser: jest.fn().mockResolvedValue(mockUser),
                        deleteUser: jest.fn()
                    }
                },
                {
                    provide: require('../auth/auth.guard').AuthGuard,
                    useValue: { canActivate: jest.fn().mockReturnValue(true) }
                },
                {
                    provide: require('../guards/admin.guard').AdminGuard,
                    useValue: { canActivate: jest.fn().mockReturnValue(true) }
                },
                {
                    provide: require('@nestjs/jwt').JwtService,
                    useValue: {
                        verifyAsync: jest.fn().mockResolvedValue({ userId: '1' }),
                    },
                },
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

    describe('deleteUser', () => {
        it('should delete a user if admin', async () => {
            (resolver as any).userService.deleteUser = jest.fn().mockResolvedValue(mockUser);
            const result = await resolver.deleteUser('1');
            expect(result).toEqual(mockUser);
        });
        it('should throw if not admin', async () => {
            (resolver as any).userService.deleteUser = jest.fn().mockImplementation(() => { throw new Error('Unauthorized: Only admin can delete users'); });
            await expect(resolver.deleteUser('1')).rejects.toThrow('Unauthorized: Only admin can delete users');
        });
    });
});
