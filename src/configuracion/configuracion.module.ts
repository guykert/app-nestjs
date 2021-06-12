import { Module } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { ConfiguracionController } from './configuracion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfiguracionSchema } from './schemas';
import { Configuracion, ConfiguracionDesarrollo } from './entities';


@Module({
  imports: [


    TypeOrmModule.forFeature([Configuracion], 'nueva_estructura'),
    TypeOrmModule.forFeature([ConfiguracionDesarrollo], 'desarrollo'),
    
    MongooseModule.forFeature([
      {name: 'Configuracion' , schema:ConfiguracionSchema}
    ]),


  ],
  controllers: [ConfiguracionController],
  providers: [ConfiguracionService],
  exports : [ConfiguracionService]
})
export class ConfiguracionModule {}
