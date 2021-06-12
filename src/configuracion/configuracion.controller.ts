import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { CreateConfiguracionDto, UpdateConfiguracionDto } from './dto/';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Configuracion')
@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @Post()
  async create(@Body(ValidationPipe) createConfiguracionDto: CreateConfiguracionDto) {

    return {
      create_mongo: await this.configuracionService.create(createConfiguracionDto),
      create_mysql: await this.configuracionService.createMysql(createConfiguracionDto),
    };

  }

  @Get()
  async findAll() {

    return {
      find_mongo: await this.configuracionService.findAll(),
      find_mysql: await this.configuracionService.findAllMysql(),
    };

  }

  @Get('find-one/:id')
  async findOne(@Param('id') id: string) {

    return {
      find_mongo: await this.configuracionService.findOne(id),
      find_mysql: await this.configuracionService.findOneMysql(id),
    };

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateConfiguracionDto: UpdateConfiguracionDto) {

    return {
      find_mongo: await this.configuracionService.update(id, updateConfiguracionDto),
      find_mysql: await this.configuracionService.updateMysql(id, updateConfiguracionDto),
    };

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    return {
      find_mongo: await this.configuracionService.remove(id),
      find_mysql: await this.configuracionService.removeMysql(id),
    };

  }

  @Get('/migrardata')
  async migrarData() {

      
        const migrar_data = await  this.configuracionService.migrarData();


      return {
        message: 'Petición correcta',
        migrar_data

      };

  }

}
