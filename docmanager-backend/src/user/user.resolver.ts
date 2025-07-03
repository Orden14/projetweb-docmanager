import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entity';
import { getRedisConnection } from '../bullmq/connection.util';
import { UserJobName } from '../enum/user.job.enum';

@Resolver(() => User)
export class UserResolver {
    private readonly queueEvents: QueueEvents;

    constructor(@InjectQueue('user') private readonly userQueue: Queue) {
        this.queueEvents = new QueueEvents('user', { connection: getRedisConnection() });
    }

    @Query(() => [User])
    async findAllUsers(): Promise<User[]> {
        const job = await this.userQueue.add(UserJobName.FindAllUsers, {});

        return await job.waitUntilFinished(this.queueEvents) as User[];
    }

    @Query(() => User, { nullable: true })
    async getUserById(@Args('id') id: string): Promise<User | null> {
        const job = await this.userQueue.add(UserJobName.FindUserById, { id });

        return await job.waitUntilFinished(this.queueEvents) as User;
    }

    @Mutation(() => User)
    async createUser(@Args('createUserDto') createUserDto: CreateUserDto): Promise<User> {
        const job = await this.userQueue.add(UserJobName.CreateUser, createUserDto);

        return await job.waitUntilFinished(this.queueEvents) as User;
    }
}
