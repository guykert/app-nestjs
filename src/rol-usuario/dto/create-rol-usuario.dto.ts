import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateRolUsuarioDto {

    @IsString()
    @IsNotEmpty()
    usuario_id:string;

    @IsString()
    @IsNotEmpty()
    rol_id:string;

    @IsInt()
    @IsNotEmpty()
    tipo_id:number;


}