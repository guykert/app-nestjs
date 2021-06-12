import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolPermisoDto, UpdateRolPermisoDto } from './dto';
import { RolPermiso } from './schemas';
import { RolPermiso as RolPermisoEntity, RolPermisoDesarrollo } from './entities';

@Injectable()
export class RolPermisoService {

  constructor(
    @InjectModel('RolPermiso') private readonly RolPermisoModule: Model<RolPermiso>,
    @InjectRepository(RolPermisoEntity, 'nueva_estructura')
    private readonly rolPermisoRepository: Repository<RolPermisoEntity>,

    @InjectRepository(RolPermisoDesarrollo, 'desarrollo')
    private readonly rolPermisoDesarrolloRepository: Repository<RolPermisoDesarrollo>,

  ) {}

  async create(createRolPermisoDto: CreateRolPermisoDto) {
    const rol = new this.RolPermisoModule(createRolPermisoDto);

    try {

      return await rol.save();

    } catch (error) {

      const [key, value] = Object.entries({ ...error }?.['keyValue'])?.[0];

      switch (error.code) {
        case 11000: // duplicate exception
          throw new ConflictException({
            
            statusCode: 409,
            message: `El valor ingresado ya existe en la base de datos`,
            error: 'Conflict',
            //message: `El campo ${key} ${value}`,
            
          });
        default:
          throw new BadRequestException(`error ${error.code}`);
      }

    }
  }

  async createMysql(createRolPermisoDto: CreateRolPermisoDto): Promise<RolPermisoEntity> {

    const newRol = await this.rolPermisoRepository.create(createRolPermisoDto);

    try {

      return await this.rolPermisoRepository.save(newRol);

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') { // duplicate username
            throw new ConflictException('El valor ingresado ya existe en la base de datos');
        } else {
            throw new InternalServerErrorException();
        }
    }

  }

  async findAll(): Promise<RolPermiso[]> {
  
    try {

        return await this.RolPermisoModule.find();

    } catch (error) {

        return error;

    }

  }

  async findAllMysql(): Promise<RolPermisoEntity[]> {

    return await this.rolPermisoRepository.find();

  }

  async getByNombreMysql(nombre: string) {
    const user = await this.rolPermisoRepository.findOne({ nombre: nombre });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async getByNombre(nombre: string) {
    const user = await this.RolPermisoModule.findOne({ nombre: nombre });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async findOne(id: string): Promise<RolPermiso>  {
  
    try {

      return await this.RolPermisoModule.findById(id);

    } catch (error) {

      return null;

    }

  }

  async findOneMysql(id: string) {

    try {

      return await this.rolPermisoRepository.findOne(id);

    } catch (error) {

      return {};

    }

  }

  async update(id: string,updateRolPermisoDto: UpdateRolPermisoDto){
  
    try {

      return await this.RolPermisoModule.findOneAndUpdate({ _id: id}, updateRolPermisoDto, { new: true });

    } catch (error) {

      return {};

    }

  }

  async updateMysql(id: string,updateRolPermisoDto: UpdateRolPermisoDto) {

    try {

      const update = await this.rolPermisoRepository.update( id,  updateRolPermisoDto );

      return await this.findOneMysql(id);

    } catch (error) {

      return {};

    }

  }

  async remove(id: string) {
  
    try {

      return await this.RolPermisoModule.findByIdAndDelete(id);

    } catch (error) {

      return {};

    }

  }

  async removeMysql(id: string) {

    try {

      const deleteAnterior = await this.findOneMysql(id);

      await this.rolPermisoRepository.delete(id);

      return deleteAnterior;

    } catch (error) {

      return {};

    }

  }

  async migrarData() {
  
    const roles = await this.findAllMysqlDesarrollo();

    for (const rol of roles) {

      if(rol.type == 2){

        const createRolPermisoDto = new CreateRolPermisoDto();

        createRolPermisoDto.nombre = rol.name;

        createRolPermisoDto.descripcion = rol.description;

        this.createMysql(createRolPermisoDto);

        this.create(createRolPermisoDto);
        
      }




    }

  }

  async findAllMysqlDesarrollo(){

    return await this.rolPermisoDesarrolloRepository.find();

  }

}
