import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './create-user.dto';
import {PrismaService} from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(createUserDto: CreateUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            return this.prisma.user.create({
                data: {
                    ...createUserDto,
                    password: hashedPassword,
                },
            });
        } catch (error: any) {
            throw new Error(error?.message || 'Erreur lors de la création de l\'utilisateur');
        }
    }

    async findAllUser() {
        return this.prisma.user.findMany();
    }

    async findUserByEmail(email : string) {
        return this.prisma.user.findUnique({
            where : {
                email
            }
        })
    }

    async findUser(id: string) {
        try {
            return this.prisma.user.findUnique({
                where: {
                    id,
                },
            });
        } catch (error: any) {
            throw new Error(error?.message || 'Erreur lors de la recherche de l\'utilisateur');
        }
    }
}
