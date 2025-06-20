import { Field, InputType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: Role;
}
