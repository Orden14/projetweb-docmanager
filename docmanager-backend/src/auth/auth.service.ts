import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService
    ) {}

    async signIn(email : string, password : string) : Promise<{access_token : string}> {
        const user = await this.userService.findUserByEmail(email)

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Mot de passe ou email incorrect');
        }
        
        const payload = {sub : user.id, email : user.email, role : user.role}

        return {
            access_token : await this.jwtService.signAsync(payload)
        }
    }

}