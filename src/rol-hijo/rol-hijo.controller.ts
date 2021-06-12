import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { RolHijoService } from './rol-hijo.service';
import { CreateRolHijoDto } from './dto/create-rol-hijo.dto';
import { UpdateRolHijoDto } from './dto/update-rol-hijo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rol Hijo')
@Controller('rol-hijo')
export class RolHijoController {
  constructor(private readonly rolHijoService: RolHijoService) {}

  @Post()
  async create(@Body(ValidationPipe) createRolHijoDto: CreateRolHijoDto) {

    return {
      create_mysql: await this.rolHijoService.createMysql(createRolHijoDto),
    };

  }

  @Get()
  async findAll() {

    return {
      find_mysql: await this.rolHijoService.findAllMysql(),
    };

  }

  @Get('find-one/:id')
  async findOne(@Param('id') id: string) {

    return {
      find_mysql: await this.rolHijoService.findOneMysql(id),
    };

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateRolHijoDto: UpdateRolHijoDto) {

    return {
      find_mysql: await this.rolHijoService.updateMysql(id, updateRolHijoDto),
    };

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    return {
      find_mysql: await this.rolHijoService.removeMysql(id),
    };

  }

  @Get('/migrardata')
  async migrarData() {

      
        const migrar_data = await  this.rolHijoService.migrarData();


      return {
        message: 'Petición correcta',
        migrar_data

      };

  }

}
