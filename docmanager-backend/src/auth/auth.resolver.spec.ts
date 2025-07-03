import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
    let resolver: AuthResolver;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthResolver,
                {
                    provide: AuthService,
                    useValue: {
                        signIn: jest.fn().mockResolvedValue({ access_token: 'jwt-token' }),
                    },
                },
            ],
        }).compile();

        resolver = module.get<AuthResolver>(AuthResolver);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should return a JWT token on signIn', async () => {
        const result = await resolver.signIn('test@example.com', 'password');
        expect(result).toBe('jwt-token');
        expect(authService.signIn).toHaveBeenCalledWith('test@example.com', 'password');
    });
});
