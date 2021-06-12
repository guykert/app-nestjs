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



    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());

    if(!roles){

      return true;

    }

    const request = context.switchToHttp().getRequest();

    const { user } = request;

    // console.log(user.user_mysql);

    // console.log(user.user_mongo);

    // console.log(context.getHandler());

    const roles_usuario = user.user_mysql.roles.map( r => r.nombre);

    // console.log(roles_usuario);
    // console.log(roles);


    // const hasRole = () => roles_usuario.some(
      
    //   (role: string) => roles.includes(role.toString())
      
    // );

    // const hasRole = () => roles_usuario.some(
      
    //   (role: string) => console.log(role)
      
    // );

    const hasRole = user.user_mysql.roles.some(rol => roles.includes(rol.nombre));

    // const hasRole = () => roles_usuario.some(

    //   rol => roles.includes(rol.nombre)

    // );

    //console.log(((user.user_mysql && user.user_mysql.roles )));

    //console.log(roles.includes('administrador'));

    // console.log(hasRole);

    

    // return  (user.user_mysql && user.user_mysql.roles ) || (user.user_mongo && user.user_mongo.roles ) && hasRole();

    return  ((user.user_mysql && user.user_mysql.roles ) || (user.user_mongo && user.user_mongo.roles )) && hasRole;

  }
}
