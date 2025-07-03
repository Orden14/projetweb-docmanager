import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import {UserProcessor} from "./user.processor";

@Module({
    providers: [UserResolver, UserService, UserProcessor],
    exports: [UserService],
})

export class UserModule {}
