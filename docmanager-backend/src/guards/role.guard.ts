import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly requiredRole: Role) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return user?.role === this.requiredRole;
    }
}
