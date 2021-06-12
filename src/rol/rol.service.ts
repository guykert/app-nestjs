import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol as RolEntity} from './entities';
import { Rol } from './schemas';
import { RolDesarrollo } from './entities/rol-desarrollo.entity';


@Injectable()
export class RolService {

  constructor(
    @InjectModel('Rol') private readonly rolModule: Model<Rol>,
    @InjectRepository(RolEntity, 'nueva_estructura')
    private readonly rolRepository: Repository<RolEntity>,

    @InjectRepository(RolDesarrollo, 'desarrollo')
    private readonly rolDesarrolloRepository: Repository<RolDesarrollo>,

  ) {}



    async create(createRolDto: CreateRolDto) {
      const configuracion = new this.rolModule(createRolDto);
  
      try {
  
        return await configuracion.save();
  
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
  
    async createMysql(createRolDto: CreateRolDto): Promise<RolEntity> {
  
      const newConfiguracion = await this.rolRepository.create(createRolDto);
  
      try {
  
        return await this.rolRepository.save(newConfiguracion);
  
      } catch (error) {
  
          if (error.code === 'ER_DUP_ENTRY') { // duplicate username
              throw new ConflictException('El valor ingresado ya existe en la base de datos');
          } else {
              throw new InternalServerErrorException();
          }
      }
  
    }
  
    async findAll(): Promise<Rol[]> {
  
      try {
  
          return await this.rolModule.find();
  
      } catch (error) {
  
          return error;
  
      }
  
    }
  
    async findAllMysql(): Promise<RolEntity[]> {
  
      return await this.rolRepository.find();
  
    }
  
    async findOne(id: string): Promise<Rol> {
  
      try {
  
        return await this.rolModule.findById(id);
  
      } catch (error) {
  
        return null;
  
      }
  
    }
  
    async findOneMysql(id: string): Promise<RolEntity>{
  
      try {
  
        return await this.rolRepository.findOne(id);
  
      } catch (error) {
  
        return null;
  
      }
  
    }
  
    async update(id: string,updateRolDto: UpdateRolDto){
  
      try {
  
        return await this.rolModule.findOneAndUpdate({ _id: id}, updateRolDto, { new: true });
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async updateMysql(id: string,updateRolDto: UpdateRolDto) {
  
      try {
  
        const update = await this.rolRepository.update( id,  updateRolDto );
  
        return await this.findOneMysql(id);
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async remove(id: string) {
  
      try {
  
        return await this.rolModule.findByIdAndDelete(id);
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async removeMysql(id: string) {
  
      try {
  
        const deleteAnterior = await this.findOneMysql(id);
  
        await this.rolRepository.delete(id);
  
        return deleteAnterior;
  
      } catch (error) {
  
        return {};
  
      }
  
    }

    async getByNombreMysql(nombre: string) {
      const user = await this.rolRepository.findOne({ nombre: nombre });
      if (user) {
        return user;
      }
      throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }
  
    async getByNombre(nombre: string) {
      const user = await this.rolModule.findOne({ nombre: nombre });
      if (user) {
        return user;
      }
      throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }
  
    async migrarData() {
  
      const roles = await this.findAllMysqlDesarrollo();

      for (const rol of roles) {

        if(rol.type == 1){

          const createRolDto = new CreateRolDto();

          createRolDto.nombre = rol.name;
  
          createRolDto.descripcion = rol.description;
  
          this.createMysql(createRolDto);
  
          this.create(createRolDto);
          
        }




      }
  
    }

    async findAllMysqlDesarrollo(){
  
      return await this.rolDesarrolloRepository.find();
  
    }
    
}
