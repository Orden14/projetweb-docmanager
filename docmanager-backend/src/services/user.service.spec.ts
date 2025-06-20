import { UserService } from './user.service';
import { User } from '../entities/user.entity';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
    });

    it('devrait créer un utilisateur', () => {
        const user: User = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' };
        const createdUser = userService.create(user);
        expect(createdUser).toEqual(user);
        expect(userService.findAll()).toContain(user);
    });

    it('devrait retourner tous les utilisateurs', () => {
        const user1: User = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' };
        const user2: User = { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'user' };
        userService.create(user1);
        userService.create(user2);
        const users = userService.findAll();
        expect(users).toEqual([user1, user2]);
    });
});
