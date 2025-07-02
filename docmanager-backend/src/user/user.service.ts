import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './create-user.dto';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(createUserDto: CreateUserDto) {
        return await this.prisma.user.create({
            data: createUserDto,
        });
    }

    async findAllUser() {
        return await this.prisma.user.findMany();
    }

    async findUser(id: string) {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
}
