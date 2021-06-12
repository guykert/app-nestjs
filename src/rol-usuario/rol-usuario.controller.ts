import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolUsuarioService } from './rol-usuario.service';
import { CreateRolUsuarioDto } from './dto/create-rol-usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol-usuario.dto';

@Controller('rol-usuario')
export class RolUsuarioController {
  constructor(private readonly rolUsuarioService: RolUsuarioService) {}


}
