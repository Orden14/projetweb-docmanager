import { UserResolver } from './user.resolver';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserResolver', () => {
    let userResolver: UserResolver;
    let mockUserService: UserService;

    beforeEach(() => {
        mockUserService = { create: jest.fn(), findAll: jest.fn() } as unknown as UserService;
        userResolver = new UserResolver(mockUserService);
    });

    it('devrait créer un utilisateur', () => {
        const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john@example.com', role: 'admin' };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = { id: expect.any(String), ...createUserDto };

        jest.spyOn(mockUserService, 'create').mockReturnValue(user);

        const result = userResolver.createUser(createUserDto);
        expect(result).toEqual(user);
        expect(mockUserService.create).toHaveBeenCalledWith(user);
    });

    it('devrait retourner tous les utilisateurs', () => {
        const users = [{ id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' }];
        jest.spyOn(mockUserService, 'findAll').mockReturnValue(users);

        const result = userResolver.findAllUsers();
        expect(result).toEqual(users);
        expect(mockUserService.findAll).toHaveBeenCalled();
    });
});
