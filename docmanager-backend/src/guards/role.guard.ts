import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Role} from '../enum/role.enum';
import {Request} from 'express';
import {User} from "../entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly requiredRole: Role) {
    }

    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const user: User|undefined = request.user;

        return user?.role === this.requiredRole;
    }
}
