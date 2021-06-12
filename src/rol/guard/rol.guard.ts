import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ){

  }
  canActivate(
    context: ExecutionContext,
  ): boolean {

    console.log('context');
    console.log(context.getHandler());

    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());

    const roles2 = this.reflector.get<string[]>('roles', context.getHandler());

    const roles3 = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(roles);

    console.log(roles2);

    console.log(roles3);

    if(!roles){

      return true;

    }

    const request = context.switchToHttp().getRequest();

    const { user } = request;

    const hasRole = () => user.roles.some((role: string) => roles.includes(role));

    return user && user.roles && hasRole();

  }
}
