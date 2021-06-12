import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { Usuario } from './usuario/entities';
import { UsuarioModule } from './usuario/usuario.module';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; 
import { DatabaseDesarrolloConfig } from './config/database_desarrollo.config';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { RolModule } from './rol/rol.module';
import { AuthModule } from './auth/auth.module';
import { RolHijoModule } from './rol-hijo/rol-hijo.module';
import { RolPermisoModule } from './rol-permiso/rol-permiso.module';
import { RolUsuarioModule } from './rol-usuario/rol-usuario.module';
import { roles } from './app.roles';
import { AccessControlModule } from 'nest-access-control';



const musicEntities = [
  Usuario
];

@Module({
  imports: [

    ConfigModule.forRoot({
      
      isGlobal: true,
      load: [config],
      envFilePath: ['.env'],
    }),

    MongooseModule.forRoot('mongodb://localhost:27017/nueva-estructura?readPreference=primary&appname=MongoDB%20Compass&ssl=false'),

    TypeOrmModule.forRootAsync({
      name: 'nueva_estructura',
      imports: [ConfigModule],
      useClass:  DatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'desarrollo',
      imports: [ConfigModule],
      useClass:  DatabaseDesarrolloConfig,
      inject: [ConfigService],
    }),

    AccessControlModule.forRoles(roles),

    AuthModule,

    UsuarioModule,

    ConfiguracionModule,

    RolModule,

    AuthModule,

    RolHijoModule,

    RolPermisoModule,

    RolUsuarioModule
   

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
