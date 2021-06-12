import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateConfiguracionDto {

    @IsString()
    @IsNotEmpty()
    anio_academico:string;

    @IsInt()
    anio_forzado:number;

}

