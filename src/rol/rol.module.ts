import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities';
import { MongooseModule } from '@nestjs/mongoose';
import { RolSchema } from './schemas';
import { RolDesarrollo } from './entities/rol-desarrollo.entity';


@Module({
  imports: [

    TypeOrmModule.forFeature([Rol], 'nueva_estructura'),
    TypeOrmModule.forFeature([RolDesarrollo], 'desarrollo'),

    MongooseModule.forFeature([
      {name: 'Rol' , schema:RolSchema}
    ]),


  ],
  controllers: [RolController],
  providers: [RolService],
  exports : [RolService]
})
export class RolModule {}
