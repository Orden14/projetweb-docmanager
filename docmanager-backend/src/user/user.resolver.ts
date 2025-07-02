import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => [User])
    async findAllUsers(): Promise<User[]> {
        return await this.userService.findAllUser();
    }

    @Query(() => User, { nullable: true })
    async getUserById(@Args('id') id: string): Promise<User | null> {
        return await this.userService.findUser(id);
    }

    @Mutation(() => User)
    async createUser(@Args('createUserDto') createUserDto: CreateUserDto): Promise<User> {
        return await this.userService.createUser(createUserDto);
    }
}
