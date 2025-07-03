import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => String, { name: 'signIn' })
    async signIn(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<string> {
        const result = await this.authService.signIn(email, password);
        return result.access_token;
    }
}
