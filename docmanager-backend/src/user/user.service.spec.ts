import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
// import { User } from '@prisma/client'; // supprimé car inutilisé
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
    let service: UserService;
    let prismaService: PrismaService;

    const mockUser: any = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'USER',
        createdAt: new Date()
    };

    const mockCreateUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: 'USER'
    };

    beforeEach(async () => {
        (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('hashedPassword');
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            create: jest.fn().mockResolvedValue(mockUser),
                            findMany: jest.fn().mockResolvedValue([mockUser]),
                            findUnique: jest.fn().mockResolvedValue(mockUser),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const result = await service.createUser(mockCreateUserDto);
            expect(result).toEqual(mockUser);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    ...mockCreateUserDto,
                    password: 'hashedPassword',
                },
            });
        });
    });

    describe('findAllUser', () => {
        it('should return all users', async () => {
            const result = await service.findAllUser();
            expect(result).toEqual([mockUser]);
            expect(prismaService.user.findMany).toHaveBeenCalled();
        });
    });

    describe('findUser', () => {
        it('should return a user by id', async () => {
            const id = '1';
            const result = await service.findUserById(id);
            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id },
            });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user if admin', async () => {
            prismaService.user.delete = jest.fn().mockResolvedValue(mockUser);
            const result = await service.deleteUser('1');
            expect(result).toEqual(mockUser);
        });
        it('should throw if not admin', async () => {
            prismaService.user.delete = jest.fn().mockImplementation(() => { throw new Error('Unauthorized: Only admin can delete users'); });
            await expect(service.deleteUser('1')).rejects.toThrow('Unauthorized: Only admin can delete users');
        });
    });
});
