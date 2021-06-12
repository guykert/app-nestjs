import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario as UsuarioEntity } from './entities';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { Usuario } from './schemas';
import * as bcrypt from 'bcrypt';
import { UsuarioDesarrollo } from './entities/usuario-desarrollo.entity';
import { RolService } from 'src/rol/rol.service';
import { RolPermisoService } from 'src/rol-permiso/rol-permiso.service';
import { RolUsuarioService } from 'src/rol-usuario/rol-usuario.service';


@Injectable()
export class UsuarioService {

  proceso_migracion: number = 0;

  constructor(
    @InjectModel('Usuario') private readonly usuarioModule: Model<Usuario>,
    @InjectRepository(UsuarioEntity, 'nueva_estructura')
    private readonly usuarioRepository: Repository<UsuarioEntity>,

    @InjectRepository(UsuarioDesarrollo, 'desarrollo')
    private readonly usuarioDesarrolloRepository: Repository<UsuarioDesarrollo>,

    private readonly rolService:RolService,
    private readonly rolPermisoService:RolPermisoService,

    private readonly rolUsuarioService:RolUsuarioService,

    // private proceso_migracion:number = 0,

  ) {
    
  }


    async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
      const usuario = new this.usuarioModule(createUsuarioDto);
  
      try {
  
        return await usuario.save();
  
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
  
    async createMysql(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioEntity> {
  
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
  
      const newUser = await this.usuarioRepository.create(createUsuarioDto);
  
      newUser.salt = await bcrypt.genSalt(10);
  
      // var new_password = newUser.rut.slice(0, -2);
  
      // new_password = new_password.split("").reverse().join("");
  
      // new_password = new_password.slice(0, 4);
  
      // new_password = new_password.split("").reverse().join("");
  
      // newUser.password = await bcrypt.hash(new_password, newUser.salt);

      newUser.password = hashedPassword;

      if(this.proceso_migracion == 1){

        try {
  
          return await this.usuarioRepository.save(newUser);

        } catch (error) {
          console.log(error);
        }

      }else{

        try {
  
          return await this.usuarioRepository.save(newUser);
    
        } catch (error) {
  
          console.log(this.proceso_migracion);
  
            if (error.code === 'ER_DUP_ENTRY') { // duplicate username
                throw new ConflictException('El valor ingresado ya existe en la base de datos');
            } else {
                throw new InternalServerErrorException();
            }
        }

      }
  

  
    }
  
    async findAll(): Promise<Usuario[]> {
  
      try {
  
          return await this.usuarioModule.find();
  
      } catch (error) {
  
          return error;
  
      }
  
    }
  
    async findAllMysql(): Promise<UsuarioEntity[]> {
  
      return await this.usuarioRepository.find();
  
    }
  
    async getByEmailMysql(email: string) {
      const user = await this.usuarioRepository.findOne({ email });
      if (user) {
        return user;
      }
      throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }
  
    async getByEmail(email: string) {
      const user = await this.usuarioModule.findOne({ email });
      if (user) {
        return user;
      }
      throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }
  
    async findOne(usuarioID: string): Promise<Usuario> {
  
      try {
  
        return await this.usuarioModule.findById(usuarioID);
  
      } catch (error) {
  
        return null;
  
      }
  
    }
  
    async findOneMysql(usuarioID: string): Promise<UsuarioEntity>{
  
      try {
  
        return await this.usuarioRepository.findOne(usuarioID);
  
      } catch (error) {
  
        return null;
  
      }
  
    }
  
    async getUsuarioEmail(email: string) {
  
      try {
  
        return await this.usuarioModule.find({ email: email });
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async getUsuarioEmailMysql(email: string) {
  
      try {
  
        return await this.usuarioRepository.find({ email: email });
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async update(usuarioID: string,updateUsuarioDto: UpdateUsuarioDto){
  
      try {
  
        return await this.usuarioModule.findOneAndUpdate({ _id: usuarioID}, updateUsuarioDto, { new: true });
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async updateMysql(usuarioID: string,updateUsuarioDto: UpdateUsuarioDto) {
  
      try {
  
        const update = await this.usuarioRepository.update( usuarioID,  updateUsuarioDto );
  
        
  
        return await this.findOneMysql(usuarioID);
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async remove(usuarioID: string) {
  
      try {
  
        return await this.usuarioModule.findByIdAndDelete(usuarioID);
  
      } catch (error) {
  
        return {};
  
      }
  
    }
  
    async removeMysql(usuarioID: string) {
  
      try {
  
        const deleteAnterior = await this.findOneMysql(usuarioID);
  
        await this.usuarioRepository.delete(usuarioID);
  
        return deleteAnterior;
  
      } catch (error) {
  
        return {};
  
      }
  
    }

    async migrarData() {

      this.proceso_migracion = 1;
  
      const usuarios = await this.findAllMysqlDesarrollo();

      for (const usuario of usuarios) {

          

          const createUsuarioDto = new CreateUsuarioDto();

          createUsuarioDto.rut = usuario.rut;
  
          createUsuarioDto.apellido_paterno = usuario.apellido_paterno;

          createUsuarioDto.apellido_materno = usuario.apellido_materno;

          createUsuarioDto.email = usuario.email;

          createUsuarioDto.password = this.crearClavePorDefecto(usuario.rut);

          console.log(createUsuarioDto);
  
          await this.createMysql(createUsuarioDto);
  
          //this.create(createUsuarioDto);

      }
  
    }

    crearClavePorDefecto(rut){
  
      var new_password = rut.slice(0, -2);

      new_password = new_password.split("").reverse().join("");

      new_password = new_password.slice(0, 4);

      new_password = new_password.split("").reverse().join("");

      return new_password;
  
    }

    async findAllMysqlDesarrollo(){

      return await this.usuarioDesarrolloRepository.find();
  
      // return await this.usuarioDesarrolloRepository.find({
      //   take: 100
      // });
  
    }

    async asignarRolUsuario(usuarioID: string,rolID: string){

      const userExist = await this.findOne(usuarioID);

      //console.log(userExist);

      if( !userExist ){
        throw new NotFoundException;
      }
  
      const rolExist = await this.rolService.findOne(rolID);

      if( !rolExist ){
        throw new NotFoundException;
      }

      const roles = userExist.roles.map(el => el._id);

      if(!roles.includes(rolExist._id)){

        if (Array.isArray(userExist.roles)) {

          userExist.roles.push(rolExist);

        } else {

          userExist.roles = [rolExist];

        }

        await userExist.save();
        
      }


  
    }

    async asignarRolUsuarioMysql(usuarioID: string,rolID: string){


      const userExist = await this.findOneMysql(usuarioID);

      if( !userExist ){
        throw new NotFoundException;
      }
  
      const rolExist = await this.rolService.findOneMysql(rolID);
  
      if( !rolExist ){
        throw new NotFoundException;
      }

      await this.rolUsuarioService.asignarRol(usuarioID,rolID,1);


  
    }

    async asignarPermisoUsuario(usuarioID: string,rolID: string){


      const userExist = await this.findOne(usuarioID);

      if( !userExist ){
        throw new NotFoundException;
      }
  
      const permisoExist = await this.rolPermisoService.findOne(rolID);
  
      if( !permisoExist ){
        throw new NotFoundException;
      }

      const permisos = userExist.permisos.map(el => el._id);

      if(!permisos.includes(permisoExist._id)){

        if (Array.isArray(userExist.roles)) {
          userExist.permisos.push(permisoExist);
        } else {
          userExist.permisos = [permisoExist];
        }

        await userExist.save();
        
      }

      await this.rolUsuarioService.asignarRol(usuarioID,rolID,2);
  
    }

    async asignarPermisoUsuarioMysql(usuarioID: string,rolID: string){


      const userExist = await this.findOneMysql(usuarioID);

      if( !userExist ){
        throw new NotFoundException;
      }
  
      const permisoExist = await this.rolPermisoService.findOneMysql(rolID);
  
      if( !permisoExist ){
        throw new NotFoundException;
      }

      await this.rolUsuarioService.asignarRol(usuarioID,rolID,2);
  
    }

    async eliminarRolUsuario(usuarioID: string,rolID: string){

      const userExist = await this.findOne(usuarioID);

      //console.log(userExist);

      if( !userExist ){
        throw new NotFoundException;
      }
  
      const rolExist = await this.rolService.findOne(rolID);

      if( !rolExist ){
        throw new NotFoundException;
      }

      const roles = userExist.roles.map(el => el._id);

      if(roles.includes(rolExist._id)){

        if (Array.isArray(userExist.roles)) {

          userExist.roles.splice(userExist.roles.findIndex(  permiso => permiso._id.toString() === rolExist._id.toString() ), 1);

          await userExist.save();


        }

        await userExist.save();
        
      }


  
    }

    async eliminarRolUsuarioMysql(usuarioID: string,rolID: string){

      const userExist = await this.findOneMysql(usuarioID);

      if( !userExist ){
        throw new NotFoundException;
      }
  
      const rolExist = await this.rolService.findOneMysql(rolID);
  
      if( !rolExist ){
        throw new NotFoundException;
      }


      await this.rolUsuarioService.eliminarRol(usuarioID,rolID,1);

    }

    async eliminarPermisoUsuario(usuarioID: string,rolID: string){

      const userExist = await this.findOne(usuarioID);

      if( !userExist ){
        throw new NotFoundException;
      }
  
      const permisoExist = await this.rolPermisoService.findOne(rolID);
  
      if( !permisoExist ){
        throw new NotFoundException;
      }

      const permisos = userExist.permisos.map(el => el._id);

      if(permisos.includes(permisoExist._id)){

        if (Array.isArray(userExist.permisos)) {

          userExist.permisos.splice(userExist.permisos.findIndex(  permiso => permiso._id.toString() === permisoExist._id.toString() ), 1);

          await userExist.save();

        }

      }

    }

    async eliminarPermisoUsuarioMysql(usuarioID: string,rolID: string){

      const userExist = await this.findOneMysql(usuarioID);

      if( !userExist ){
        throw new NotFoundException;
      }
  
      const permisoExist = await this.rolPermisoService.findOneMysql(rolID);
  
      if( !permisoExist ){
        throw new NotFoundException;
      }

      await this.rolUsuarioService.eliminarRol(usuarioID,rolID,2);
  
    }

}
