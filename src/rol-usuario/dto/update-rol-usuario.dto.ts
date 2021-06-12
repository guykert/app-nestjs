import { PartialType } from '@nestjs/swagger';
import { CreateRolUsuarioDto } from './create-rol-usuario.dto';

export class UpdateRolUsuarioDto extends PartialType(CreateRolUsuarioDto) {}
