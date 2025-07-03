import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserJobName } from '../enum/user.job.enum';
import { CreateUserDto } from './create-user.dto';

@Injectable()
@Processor('user')
export class UserProcessor extends WorkerHost {
    constructor(private readonly userService: UserService) {
        super();
    }

    async process(job: Job): Promise<any> {
        switch (job.name) {
        case UserJobName.CreateUser:
            return this.userService.createUser(job.data as CreateUserDto);
        case UserJobName.FindAllUsers:
            return this.userService.findAllUser();
        case UserJobName.FindUserById:
            return this.userService.findUser(job.data.id as string);
        default:
            throw new Error(`Unknown job name: ${job.name}`);
        }
    }
}
