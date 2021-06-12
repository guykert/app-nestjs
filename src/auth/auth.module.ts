import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from 'src/usuario/schemas/usuario.schema';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { ConfiguracionModule } from 'src/configuracion/configuracion.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports : [

    TypeOrmModule.forFeature([Usuario], 'nueva_estructura'),
    TypeOrmModule.forFeature([Usuario], 'desarrollo'),

    MongooseModule.forFeature([
      {name: 'Usuario' , schema:UsuarioSchema}
    ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('EXPIREDIN') },
      }),
    }),

    forwardRef(() => UsuarioModule),

    ConfiguracionModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports : [AuthService]
})
export class AuthModule {}
