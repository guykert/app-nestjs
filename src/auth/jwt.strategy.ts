import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // @InjectModel('Usuario') private readonly usuarioModule: Model<Usuario>,
    // @InjectRepository(UsuarioEntity)
    // private readonly usuarioRepository: Repository<UsuarioEntity>,
    private readonly authService:AuthService,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {

    // console.log('validate');

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