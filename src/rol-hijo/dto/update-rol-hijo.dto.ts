import { PartialType } from '@nestjs/swagger';
import { CreateRolHijoDto } from './create-rol-hijo.dto';

export class UpdateRolHijoDto extends PartialType(CreateRolHijoDto) {}
