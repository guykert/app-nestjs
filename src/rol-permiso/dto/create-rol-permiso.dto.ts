import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateRolPermisoDto {

    @IsString()
    @IsNotEmpty()
    nombre:string;

    @IsString()
    descripcion:string;


}
