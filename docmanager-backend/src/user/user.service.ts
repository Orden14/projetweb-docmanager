import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './create-user.dto';
import {PrismaService} from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const hashedPassword = (await bcrypt.hash(createUserDto.password, 10));
        return this.prisma.user.create({
            data: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ...createUserDto,
                password: hashedPassword,
            },
        });
    }

    async findAllUser(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findUser(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
}
