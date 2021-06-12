import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, SetMetadata } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, UserDecorator } from 'src/config/decorators';
import { Roles } from 'src/config/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolGuard } from 'src/rol/guard/rol.guard';

@ApiTags('Usuario')
@Controller('usuario')
export class UsuarioController {
  constructor(
    
    private readonly usuarioService: UsuarioService,
    
  ) {}

  
  @Post()
  async create(
    
    @Body(ValidationPipe) createUsuarioDto: CreateUsuarioDto,
    
    ) {

      return {
        create_mongo: await this.usuarioService.create(createUsuarioDto),
        create_mysql: await this.usuarioService.createMysql(createUsuarioDto),
      };
    
  }

  @Auth()
  @Get()
  @SetMetadata('roles', ['administrador'])
  @Roles('administrador')
  @UseGuards(AuthGuard(), RolGuard)
  
  async findAll() {

    return {
      find_mongo: await this.usuarioService.findAll(),
      find_mysql: await this.usuarioService.findAllMysql(),
    };

  }

  @Get('/find-one/:id')
  async findOne(@Param('id') id: string) {

    console.log('findOne');

    return {
      find_mongo: await this.usuarioService.findOne(id),
      find_mysql: await this.usuarioService.findOneMysql(id),
    };

  }

  @Get('/buscar-email/:email')
  async findOneEmail(@Param('email') email: string) {

    console.log('findOneEmail');


    return {
      find_mongo: await this.usuarioService.getUsuarioEmail(email),
      find_mysql: await this.usuarioService.getUsuarioEmailMysql(email),
    };
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {

    return {
      find_mongo: await this.usuarioService.update(id, updateUsuarioDto),
      find_mysql: await this.usuarioService.updateMysql(id, updateUsuarioDto),
    };

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    return {
      find_mongo: await this.usuarioService.remove(id),
      find_mysql: await this.usuarioService.removeMysql(id),
    };

  }

  @Get('/migrardata')
  async migrarData() {

    console.log('migrarData');

      
        const migrar_data = await  this.usuarioService.migrarData();


      return {
        message: 'Petición correcta',
        migrar_data

      };

  }

  @Get('/asignar-rol-mongo/:id_usuario/:id_rol')
  async asignarRolUsuarioMongo(@Param('id_usuario') id_usuario: string,@Param('id_rol') id_rol: string) {

    return {
      find_mongo: await this.usuarioService.asignarRolUsuario(id_usuario,id_rol),
      //find_mysql: await this.usuarioService.asignarRolUsuarioMysql(id_usuario,id_rol),
    };

  }

  @Get('/asignar-rol/:id_usuario/:id_rol')
  async asignarRolUsuario(@Param('id_usuario') id_usuario: string,@Param('id_rol') id_rol: string) {

    return {
      //find_mongo: await this.usuarioService.asignarRolUsuario(id_usuario,id_rol),
      find_mysql: await this.usuarioService.asignarRolUsuarioMysql(id_usuario,id_rol),
    };

  }

  @Get('/asignar-permiso-mongo/:id_usuario/:id_permiso')
  async asignarPermisoUsuarioMongo(@Param('id_usuario') id_usuario: string,@Param('id_permiso') id_permiso: string) {

    return {
      find_mongo: await this.usuarioService.asignarPermisoUsuario(id_usuario,id_permiso),
      //find_mysql: await this.usuarioService.asignarPermisoUsuarioMysql(id_usuario,id_permiso),
    };

  }

  @Get('/asignar-permiso/:id_usuario/:id_permiso')
  async asignarPermisoUsuario(@Param('id_usuario') id_usuario: string,@Param('id_permiso') id_permiso: string) {

    return {
      //find_mongo: await this.usuarioService.asignarPermisoUsuario(id_usuario,id_permiso),
      find_mysql: await this.usuarioService.asignarPermisoUsuarioMysql(id_usuario,id_permiso),
    };

  }

  @Get('/eliminar-rol/:id_usuario/:id_rol')
  async eliminarRolUsuario(@Param('id_usuario') id_usuario: string,@Param('id_rol') id_rol: string) {

    return {
      find_mongo: await this.usuarioService.eliminarRolUsuario(id_usuario,id_rol),
      //find_mysql: await this.usuarioService.eliminarRolUsuarioMysql(id_usuario,id_rol),
    };

  }

  @Get('/eliminar-permiso/:id_usuario/:id_permiso')
  async eliminarPermisoUsuario(@Param('id_usuario') id_usuario: string,@Param('id_permiso') id_permiso: string) {

    return {
      find_mongo: await this.usuarioService.eliminarPermisoUsuario(id_usuario,id_permiso),
      //find_mysql: await this.usuarioService.eliminarPermisoUsuarioMysql(id_usuario,id_permiso),
    };

  }

}
