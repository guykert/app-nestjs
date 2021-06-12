import { Body, Controller, Param, Get, Post, Req, UseGuards, ValidationPipe, UseInterceptors, UploadedFile, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCambioClaveDto, AuthCredentialsDto, AuthNuevaClaveDto, AuthRecuperarClaveDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, UserDecorator } from 'src/config/decorators';
import { Usuario as UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { Usuario } from 'src/usuario/schemas/usuario.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

export const storage ={
  storage: diskStorage({
    destination: "./upload/Perfil/2021",
    filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        //const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join("")
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        //Calling the callback passing the random name generated with the original extension name
        //cb(null, `${randomName}${extname(file.originalname)}`)
        cb(null, `${filename}${extension}`)
    }
  })
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(
    
    @Body(ValidationPipe) authCredentialsDto : AuthCredentialsDto,
    
    ){

    const accessTocken = await  this.authService.validateUserPassword(authCredentialsDto);

    if(!accessTocken){

        throw new UnauthorizedException("Invalid Credentials");
        
    }
    else{

      return accessTocken;
        
    }

  }

  @Post('/signinmysql')
  async signinMysql(
    
    @Body(ValidationPipe) authCredentialsDto : AuthCredentialsDto,
    
    ){

    const accessTocken = await  this.authService.validateUserPasswordMysql(authCredentialsDto);

    if(!accessTocken){

        throw new UnauthorizedException("Invalid Credentials");
        
    }
    else{

      return accessTocken;
        
    }

  }

  @Auth()
  @Post('/cambiarclave')
  async cambiarClave(

      @UserDecorator() user: Usuario,

      @Body(ValidationPipe) authCambioClaveDto: AuthCambioClaveDto,

  ) {

    return await  this.authService.cambiarClave(user['user_mongo'][0],authCambioClaveDto);

  }

}
