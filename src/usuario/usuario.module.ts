import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from './schemas/usuario.schema';
import { UsuarioDesarrollo } from './entities/usuario-desarrollo.entity';
import { RolModule } from 'src/rol/rol.module';
import { RolPermisoModule } from 'src/rol-permiso/rol-permiso.module';
import { RolUsuarioModule } from 'src/rol-usuario/rol-usuario.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [


    TypeOrmModule.forFeature([Usuario], 'nueva_estructura'),
    TypeOrmModule.forFeature([UsuarioDesarrollo], 'desarrollo'),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    MongooseModule.forFeature([
      {name: 'Usuario' , schema:UsuarioSchema}
    ]),
    RolModule,
    RolPermisoModule,
    RolUsuarioModule,
    


  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports : [UsuarioService]
})
export class UsuarioModule {}
