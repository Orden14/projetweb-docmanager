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

    async signIn(email: string, password: string) {
        try {
            const user = await this.userService.findUserByEmail(email);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new UnauthorizedException('Email ou mot de passe incorrect');
            }
            const payload = { sub: user.id, username: user.email };
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        } catch (error: any) {
            throw new UnauthorizedException(error?.message || 'Erreur lors de la connexion');
        }
    }

}