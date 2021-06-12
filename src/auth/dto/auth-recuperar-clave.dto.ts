
import { IsInt, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthRecuperarClaveDto {

    @IsString()
    // @MinLength(4)
    // @MaxLength(20)
    username: string;

}