import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './create-user.dto';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(createUserDto: CreateUserDto) {
        return this.prisma.user.create({
            data: createUserDto,
        });
    }

    async findAllUser() {
        return this.prisma.user.findMany();
    }

    async findUser(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
}
