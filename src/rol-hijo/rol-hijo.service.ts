import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateRolHijoDto, UpdateRolHijoDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolHijo as RolHijoEntity, RolHijoDesarrollo } from './entities';
import { RolService } from 'src/rol/rol.service';
import { RolPermisoService } from 'src/rol-permiso/rol-permiso.service';


@Injectable()
export class RolHijoService {

  constructor(
    @InjectRepository(RolHijoEntity, 'nueva_estructura')
    private readonly rolHijoRepository: Repository<RolHijoEntity>,

    @InjectRepository(RolHijoDesarrollo, 'desarrollo')
    private readonly rolHijoDesarrolloRepository: Repository<RolHijoDesarrollo>,

    private readonly rolService: RolService,

    private readonly rolPermisoService: RolPermisoService,

  ) {}


  async createMysql(createRolHijoDto: CreateRolHijoDto): Promise<RolHijoEntity> {

    const newRol = await this.rolHijoRepository.create(createRolHijoDto);

    

    try {

      return await this.rolHijoRepository.save(newRol);

    } catch (error) {
      console.log(error);
        if (error.code === 'ER_DUP_ENTRY') { // duplicate username
            throw new ConflictException('El valor ingresado ya existe en la base de datos');
        } else {
            throw new InternalServerErrorException();
        }
    }

  }


  async findAllMysql(): Promise<RolHijoEntity[]> {

    return await this.rolHijoRepository.find();

  }

  async findOneMysql(id: string) {

    try {

      return await this.rolHijoRepository.findOne(id);

    } catch (error) {

      return {};

    }

  }

  async findidsMysql(padre_id: string, hijo_id: string) {

    try {

      return await this.rolHijoRepository.findOne( { padre_id: padre_id, hijo_id: hijo_id } );

    } catch (error) {

      return {};

    }

  }

  async updateMysql(id: string,updateRolHijoDto: UpdateRolHijoDto) {

    try {

      const update = await this.rolHijoRepository.update( id,  updateRolHijoDto );

      return await this.findOneMysql(id);

    } catch (error) {

      return {};

    }

  }

  async removeMysql(id: string) {

    try {

      const deleteAnterior = await this.findOneMysql(id);

      await this.rolHijoRepository.delete(id);

      return deleteAnterior;

    } catch (error) {

      return {};

    }

  }

  async migrarData() {
  
    const roles = await this.findAllMysqlDesarrollo();

    

    for (const rol of roles) {

      // primero busco en rol por el nombre

      var nombre = await this.rolService.getByNombre(rol.parent);

      const nombre_mysql = await this.rolService.getByNombreMysql(rol.parent);



      const nombre_permiso = await this.rolPermisoService.getByNombre(rol.child);

      // Primero confirmo si existe el sub documento

      /// nombre.permisos.findOne({'_id': nombre_permiso._id});

      // const permiso2 = nombre.permisos.find( permiso => permiso.id === nombre_permiso._id );

      const names = nombre.permisos.map(el => el._id);

      if(!names.includes(nombre_permiso._id)){

        if (Array.isArray(nombre.permisos)) {
            nombre.permisos.push(nombre_permiso);
        } else {
            nombre.permisos = [nombre_permiso];
        }

        await nombre.save();
        
      }

      // console.log(names);

      // console.log(names.includes("60a8290baee09e1a243fe609"));


      // console.log(nombre.permisos.find(el => el.id == "60a8290baee09e1a243fe609"));
      // console.log(nombre.permisos.filter(el => el.id == "60a8290baee09e1a243fe609"));

      // console.log('listos : permiso2 : ' + permiso2);

      // console.log(nombre.permisos);

      // const permiso = nombre.permisos.find((o, i) => {

      //   if (o._id === nombre_permiso._id) {
      //     console.log('listos : true    o._id : ' + o._id + '-nombre_permiso._id : ' + nombre_permiso._id + '-');
      //     return true;
          
      //   }else{
      //     console.log('listos : false    o._id : ' + o._id + '-nombre_permiso._id : ' + nombre_permiso._id + '-');
      //     return false;
      //   }

      // });

      





      const nombre_permiso_mysql = await this.rolPermisoService.getByNombreMysql(rol.child);

      // Antes de crear confirmo si ya existe

      const existe = await this.findidsMysql(nombre_mysql.id, nombre_permiso_mysql.id);


      if(!existe){

        const createRolHijoDto = new CreateRolHijoDto();

        createRolHijoDto.padre_id = nombre_mysql.id;
  
        createRolHijoDto.hijo_id = nombre_permiso_mysql.id;
  
        this.createMysql(createRolHijoDto);

      }




    }

  }

  async findAllMysqlDesarrollo(){

    return await this.rolHijoDesarrolloRepository.find();

  }

}
