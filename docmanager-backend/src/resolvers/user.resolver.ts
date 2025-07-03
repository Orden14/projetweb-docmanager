import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => [User])
    async findAllUsers(): Promise<User[]> {
        return await this.userService.findAllUser();
    }

    @Query(() => User, { nullable: true })
    async getUserByEmail(@Args('email') email: string): Promise<User | null> {
        return await this.userService.findUserByEmail(email);
    }

    @Query(() => User, { nullable: true })
    @UseGuards(AuthGuard)
    async getUserById(@Args('id') id: string): Promise<User | null> {
        return await this.userService.findUserById(id);
    }

    @Mutation(() => User)
    async createUser(@Args('createUserDto') createUserDto: CreateUserDto): Promise<User> {
        return await this.userService.createUser(createUserDto);
    }

    @Mutation(() => User)
    @UseGuards(AdminGuard)
    async deleteUser(@Args('id') id: string): Promise<User> {
        return await this.userService.deleteUser(id);
    }
}
