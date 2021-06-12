import { Module } from '@nestjs/common';
import { RolUsuarioService } from './rol-usuario.service';
import { RolUsuarioController } from './rol-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolUsuario } from './entities';

@Module({
  imports: [

    TypeOrmModule.forFeature([RolUsuario], 'nueva_estructura'),

  ],
  controllers: [RolUsuarioController],
  providers: [RolUsuarioService],
  exports : [RolUsuarioService]
})
export class RolUsuarioModule {}
