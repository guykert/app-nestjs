import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { RolPermisoService } from './rol-permiso.service';
import { CreateRolPermisoDto } from './dto/create-rol-permiso.dto';
import { UpdateRolPermisoDto } from './dto/update-rol-permiso.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rol Permiso')
@Controller('rol-permiso')
export class RolPermisoController {
  constructor(private readonly rolPermisoService: RolPermisoService) {}

  @Post()
  async create(@Body(ValidationPipe) createRolPermisoDto: CreateRolPermisoDto) {

    return {
      create_mongo: await this.rolPermisoService.create(createRolPermisoDto),
      create_mysql: await this.rolPermisoService.createMysql(createRolPermisoDto),
    };

  }

  @Get()
  async findAll() {

    return {
      find_mongo: await this.rolPermisoService.findAll(),
      find_mysql: await this.rolPermisoService.findAllMysql(),
    };

  }

  @Get('find-one/:id')
  async findOne(@Param('id') id: string) {

    return {
      find_mongo: await this.rolPermisoService.findOne(id),
      find_mysql: await this.rolPermisoService.findOneMysql(id),
    };

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateRolPermisoDto: UpdateRolPermisoDto) {

    return {
      find_mongo: await this.rolPermisoService.update(id, updateRolPermisoDto),
      find_mysql: await this.rolPermisoService.updateMysql(id, updateRolPermisoDto),
    };

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    return {
      find_mongo: await this.rolPermisoService.remove(id),
      find_mysql: await this.rolPermisoService.removeMysql(id),
    };

  }

  @Get('/migrardata')
  async migrarData() {

      
        const migrar_data = await  this.rolPermisoService.migrarData();


      return {
        message: 'Petición correcta',
        migrar_data

      };

  }

}
