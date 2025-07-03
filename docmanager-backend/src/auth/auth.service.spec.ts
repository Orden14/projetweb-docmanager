import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an access token on valid signIn', async () => {
    const result = await service.signIn('test@example.com', 'password');
    expect(result).toEqual({ access_token: 'jwt-token' });
    expect(userService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: '1', email: 'test@example.com' });
  });
});
