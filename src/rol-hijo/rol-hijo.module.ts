import { Module } from '@nestjs/common';
import { RolHijoService } from './rol-hijo.service';
import { RolHijoController } from './rol-hijo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolHijo, RolHijoDesarrollo } from './entities';
import { RolModule } from 'src/rol/rol.module';
import { RolPermisoModule } from 'src/rol-permiso/rol-permiso.module';

@Module({
  imports: [

    TypeOrmModule.forFeature([RolHijo], 'nueva_estructura'),
    TypeOrmModule.forFeature([RolHijoDesarrollo], 'desarrollo'),

    RolModule,
    RolPermisoModule

  ],
  controllers: [RolHijoController],
  providers: [RolHijoService],
  exports : [RolHijoService]
})
export class RolHijoModule {}
