import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';

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
