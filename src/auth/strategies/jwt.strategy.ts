import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { IJwtPaiload } from '../jwt-payload.interface';
import { AuthService } from '../auth.service';
import { ConfigService } from 'nestjs-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService:AuthService,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPaiload) {
    const { username } = payload;

    const user_mysql = await this.authService.validateUser(username);

    const user_mongo = await this.authService.validateUserMysql(username);

    if (!user_mysql && !user_mongo) {

      throw new UnauthorizedException();

    }

    return {
        user_mysql: user_mysql,
        user_mongo: user_mongo
  
    };

  }
}