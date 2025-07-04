import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';

 
@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
         
        const ctx = GqlExecutionContext.create(context);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request = ctx.getContext().req || context.switchToHttp().getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = request.user;

        console.log(user)

        if (!user) {
            throw new ForbiddenException('Accès refusé : utilisateur non authentifié.');
        }

        if (user.role !== Role.ADMIN) {
            throw new ForbiddenException('Accès réservé aux administrateurs.');
        }

        return true;
    }
}