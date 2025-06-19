import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
    private readonly users: User[] = [];

    create(user: User): User {
        this.users.push(user);
        return user;
    }

    findAll(): User[] {
        return this.users;
    }
}
