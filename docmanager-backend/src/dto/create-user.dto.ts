import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, {
    name: 'Role',
});

@InputType()
export class CreateUserDto {
    @Field()
        name: string;

    @Field()
        email: string;

    @Field()
        password: string;

    @Field(() => Role)
        role: Role;
}
