import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateUsuarioMigradoDto {

    @IsString()
    @IsNotEmpty()
    rut:string;

    @IsString()
    @IsNotEmpty()
    nombre:string;

    @IsString()
    @IsNotEmpty()
    apellido_paterno:string;

    @IsString()
    apellido_materno:string;


    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsString()
    password:string;


}
