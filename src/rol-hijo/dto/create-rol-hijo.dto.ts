import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateRolHijoDto {

    @IsString()
    @IsNotEmpty()
    padre_id:string;

    @IsString()
    @IsNotEmpty()
    hijo_id:string;


}
