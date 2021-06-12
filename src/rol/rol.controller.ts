import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rol')
@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  async create(@Body(ValidationPipe) createRolDto: CreateRolDto) {

    return {
      create_mongo: await this.rolService.create(createRolDto),
      create_mysql: await this.rolService.createMysql(createRolDto),
    };

  }

  @Get()
  async findAll() {

    return {
      find_mongo: await this.rolService.findAll(),
      find_mysql: await this.rolService.findAllMysql(),
    };

  }

  @Get('find-one/:id')
  async findOne(@Param('id') id: string) {

    return {
      find_mongo: await this.rolService.findOne(id),
      find_mysql: await this.rolService.findOneMysql(id),
    };

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateRolDto: UpdateRolDto) {

    return {
      find_mongo: await this.rolService.update(id, updateRolDto),
      find_mysql: await this.rolService.updateMysql(id, updateRolDto),
    };

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    return {
      find_mongo: await this.rolService.remove(id),
      find_mysql: await this.rolService.removeMysql(id),
    };

  }

  @Get('/migrardata')
  async migrarData() {

      
        const migrar_data = await  this.rolService.migrarData();


      return {
        message: 'Petición correcta',
        migrar_data

      };

  }

}
