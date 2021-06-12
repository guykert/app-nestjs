import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateConfiguracionDto } from './dto/create-configuracion.dto';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion as ConfiguracionEntity, ConfiguracionDesarrollo } from './entities';
import { Configuracion } from './schemas';

@Injectable()
export class ConfiguracionService {

    constructor(
      @InjectModel('Configuracion') private readonly configuracionModule: Model<Configuracion>,
      @InjectRepository(ConfiguracionEntity, 'nueva_estructura')
      private readonly configuracionRepository: Repository<ConfiguracionEntity>,

      @InjectRepository(ConfiguracionDesarrollo, 'desarrollo')
      private readonly configuracionDesarrolloRepository: Repository<ConfiguracionDesarrollo>,

    ) {}


    async create(createConfiguracionDto: CreateConfiguracionDto) {
      const configuracion = new this.configuracionModule(createConfiguracionDto);
  
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
  
    async createMysql(createConfiguracionDto: CreateConfiguracionDto): Promise<ConfiguracionEntity> {
  
      const newConfiguracion = await this.configuracionRepository.create(createConfiguracionDto);
  
      try {
  
        return await this.configuracionRepository.save(newConfiguracion);
  
      } catch (error) {
  
          if (error.code === 'ER_DUP_ENTRY') { // duplicate username
              throw new ConflictException('El valor ingresado ya existe en la base de datos');
          } else {
              throw new InternalServerErrorException();
          }
      }
  
    }
  
    async findAll(): Promise<Configuracion[]> {
  
      try {
  
          return await this.configuracionModule.find();
  
      } catch (error) {
  
          return error;
  
      }
  
    }
  
    async findAllMysql(): Promise<ConfiguracionEntity[]> {
  
      return await this.configuracionRepository.find();
  
    }
  
    async findOne(id: string) {
  
      try {
  
        return await this.configuracionModule.findById(id);
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async findOneMysql(id: string) {
  
      try {
  
        return await this.configuracionRepository.findOne(id);
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async update(id: string,updateConfiguracionDto: UpdateConfiguracionDto){
  
      try {
  
        return await this.configuracionModule.findOneAndUpdate({ _id: id}, updateConfiguracionDto, { new: true });
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async updateMysql(id: string,updateConfiguracionDto: UpdateConfiguracionDto) {
  
      try {
  
        const update = await this.configuracionRepository.update( id,  updateConfiguracionDto );
  
        return await this.findOneMysql(id);
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async remove(id: string) {
  
      try {
  
        return await this.configuracionModule.findByIdAndDelete(id);
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async removeMysql(id: string) {
  
      try {
  
        const deleteAnterior = await this.findOneMysql(id);
  
        await this.configuracionRepository.delete(id);
  
        return deleteAnterior;
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async getActualizarAnioPredeterminado(anio_pedeterminado: string){
  
      var anio_forzado = 1;
  
      // Primero buscaré si existen anio forzado 2  
  
      const data = await this.configuracionRepository
          .findOne({
              where: { anio_forzado: anio_forzado},
              
              order: {
                anio_academico: 'ASC'
              }
          });
  
      if(data){
  
        if(anio_pedeterminado == data.id){
            return false;
        }else{
            return data.id;
        }
  
      }else{
        return false;
      }
  
    }

    async migrarData() {
  
      const datos = await this.findAllMysqlDesarrollo();

      for (const data of datos) {

        const createConfiguracionDto = new CreateConfiguracionDto();

        createConfiguracionDto.anio_academico = data.anio_academico;

        createConfiguracionDto.anio_forzado = data.anio_forzado;

        this.createMysql(createConfiguracionDto);

        this.create(createConfiguracionDto);

      }
  
    }

    async findAllMysqlDesarrollo(){
  
      return await this.configuracionDesarrolloRepository.find();
  
    }
}
