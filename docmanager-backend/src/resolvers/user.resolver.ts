import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => [User])
    findAllUsers(): User[] {
        return this.userService.findAll();
    }

    @Mutation(() => User)
    createUser(@Args('createUserDto') createUserDto: CreateUserDto): User {
        const user: User = { id: uuidv4(), ...createUserDto };
        return this.userService.create(user);
    }
}
