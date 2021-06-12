import { IsInt, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthNuevaClaveDto {


    @IsString()
    // @MinLength(8)
    // @MaxLength(60)
    // @Matches(
    //     /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //     { message: 'password too weak' },
    // )
    password: string;

    @IsString()
    // @MinLength(8)
    // @MaxLength(60)
    // @Matches(
    //     /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //     { message: 'password too weak' },
    // )
    repetir_clave: string;

    // @IsInt()
    // anio_predeterminado : number;

}