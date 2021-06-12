import { IsInt, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {

    @IsString()
    // @MinLength(4)
    // @MaxLength(20)
    username: string;

    @IsString()
    // @MinLength(8)
    // @MaxLength(60)
    // @Matches(
    //     /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //     { message: 'password too weak' },
    // )
    password: string;

    // @IsInt()
    // anio_predeterminado : number;

}