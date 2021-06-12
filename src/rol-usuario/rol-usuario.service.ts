import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolUsuarioDto } from './dto';
import { RolUsuario } from './entities';

@Injectable()
export class RolUsuarioService {
  constructor(
    @InjectRepository(RolUsuario, 'nueva_estructura')
    private readonly rolUsuarioRepository: Repository<RolUsuario>,

  ) {}

  tipo_id: number = 1;

  async create(usuarioID: string, rolID: string): Promise<RolUsuario> {

    const createRolUsuarioDto = new CreateRolUsuarioDto;

    createRolUsuarioDto.rol_id = rolID;

    createRolUsuarioDto.usuario_id = usuarioID;

    createRolUsuarioDto.tipo_id = this.tipo_id;

    const newRol = await this.rolUsuarioRepository.create(createRolUsuarioDto);

    try {

      return await this.rolUsuarioRepository.save(newRol);

    } catch (error) {
      console.log(error);
        if (error.code === 'ER_DUP_ENTRY') { // duplicate username
            throw new ConflictException('El valor ingresado ya existe en la base de datos');
        } else {
            throw new InternalServerErrorException();
        }
    }

  }

  async confirmarExist(usuarioID: string, rolID: string): Promise<boolean> {

    const existe =  await this.rolUsuarioRepository.findOne({ usuario_id: usuarioID, rol_id: rolID, activo: true, tipo_id: this.tipo_id });


    if(existe){
      return true;
    }else{
      return false;
    }

  }

  async asignarRol(usuarioID: string, rolID: string, tipoID: number) {

    this.tipo_id = tipoID;

    const existe = await this.confirmarExist(usuarioID,rolID);


    if(!existe){
      await this.create(usuarioID,rolID);
    }

  }

  async eliminarRol(usuarioID: string, rolID: string, tipoID: number) {

    this.tipo_id = tipoID;

    const existe = await this.confirmarExist(usuarioID,rolID);


    if(existe){
      await this.delete(usuarioID,rolID);
    }

  }

  async delete(usuarioID: string, rolID: string){

    const deleteAnterior = await this.rolUsuarioRepository.findOne({ usuario_id: usuarioID, rol_id: rolID, activo: true, tipo_id: this.tipo_id });

    deleteAnterior.activo = false;

    const borrado = await this.rolUsuarioRepository.save(deleteAnterior);

    console.log(borrado);

  }

}
