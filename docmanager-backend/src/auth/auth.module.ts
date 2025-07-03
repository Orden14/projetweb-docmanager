import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            global : true,
            secret : process.env.JWT_SECRET,
            signOptions: {expiresIn : '60s'},
        })
    ],
    providers: [AuthService, UserService, AuthResolver],
    exports : [AuthService]
})
export class AuthModule {}