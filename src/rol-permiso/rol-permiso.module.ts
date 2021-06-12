import { Module } from '@nestjs/common';
import { RolPermisoService } from './rol-permiso.service';
import { RolPermisoController } from './rol-permiso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { RolPermisoSchema } from './schemas';
import { RolPermiso, RolPermisoDesarrollo } from './entities';

@Module({
  imports: [

    TypeOrmModule.forFeature([RolPermiso], 'nueva_estructura'),
    TypeOrmModule.forFeature([RolPermisoDesarrollo], 'desarrollo'),

    MongooseModule.forFeature([
      {name: 'RolPermiso' , schema:RolPermisoSchema}
    ]),


  ],
  controllers: [RolPermisoController],
  providers: [RolPermisoService],
  exports : [RolPermisoService]
})
export class RolPermisoModule {}
