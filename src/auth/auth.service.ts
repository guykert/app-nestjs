import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Usuario as UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { Usuario } from 'src/usuario/schemas/usuario.schema';


import { AuthCambioClaveDto, AuthCredentialsDto, AuthNuevaClaveDto, AuthRecuperarClaveDto } from './dto';
import { ConfiguracionService } from 'src/configuracion/configuracion.service';
import { EmailOptions } from 'src/config/mailgun/email-options';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel('Usuario') private readonly usuarioModule: Model<Usuario>,
    @InjectRepository(UsuarioEntity, 'nueva_estructura')
    private readonly usuarioRepository: Repository<UsuarioEntity>,

    @InjectRepository(UsuarioEntity, 'desarrollo')
    private readonly usuarioDesarrolloRepository: Repository<UsuarioEntity>,

    private jwtService: JwtService,
    private readonly configuracionService:ConfiguracionService,
    private config: ConfigService,

    ) {}

  async validateUser(username:string): Promise<Usuario> {

    return await this.usuarioModule.findOne({ rut: username });

  }

  async validateUserMysql(username:string): Promise<UsuarioEntity> {

    return  await this.usuarioRepository.findOne({rut: username});

  }

  async validateUserPassword(authCredentialsDto : AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.usuarioModule.findOne({ rut: username });

    if(user && await this.validatePassword(user.salt, user.password , password)){

      const anio_forzado = await  this.chequearAnioPredeterminado(user.anio_predeterminado);

      if(anio_forzado){

        user.anio_predeterminado = anio_forzado;

      }

      user.save();



      const payload: JwtPayload = { 

        id: user.id,
        username:user.rut,
        email:user.email, 
        roles:user.roles.map( r => r.nombre)

      };

      //console.log(payload);


      const accessTocken = await this.jwtService.sign(payload);

      return accessTocken;

    }else{
        return null;
    }
  }

  async validateUserPasswordMysql(authCredentialsDto : AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.usuarioRepository.findOne({rut: username});

    if(user && await this.validatePassword(user.salt, user.password , password)){

      const anio_forzado = await  this.chequearAnioPredeterminado(user.anio_predeterminado);

      if(anio_forzado){

        user.anio_predeterminado = anio_forzado;

      }

      await this.usuarioRepository.save(user);

      const payload: JwtPayload = { 
        
        id: user.id,
        username:user.rut,
        email:user.email, 
        roles:user.roles.map( r => r.nombre)

       };

      const accessTocken = await this.jwtService.sign(payload);

      

      return accessTocken;



    }else{
        return null;
    }
  }

  async validatePassword(usuario_salt: string, usuario_password: string,  password: string): Promise<boolean> {

    const hash = await bcrypt.hash(password,usuario_salt);

    return hash === usuario_password;

  }

  async chequearAnioPredeterminado( anio_predeterminado : string) {

    return await this.configuracionService.getActualizarAnioPredeterminado(anio_predeterminado);

  }

  async cambiarClave(user:Usuario, authCambioClaveDto : AuthCambioClaveDto){

    const { clave_anterior, password, repetir_clave} = authCambioClaveDto;

    const comparar_clave_anterior = await this.validatePassword(user.salt,user.password,clave_anterior);

    if(!comparar_clave_anterior){  

      throw new UnauthorizedException("Las clave anterior no coincide");
      
    }

    const comparar = this.compararPassword(password,repetir_clave);

    if(!comparar){  
  
        throw new UnauthorizedException("Las claves no coinciden");
        
    }

    user.salt = await bcrypt.genSalt(13);
    user.password = await this.hashPassword(password, user.salt);

    try {

      const user2 =  await this.usuarioModule.findOneAndUpdate({ _id: user.id}, user);

      const payload: JwtPayload = {
        
        id: user.id,
        username:user.rut,
        email:user.email, 
        roles:user.roles.map( r => r.nombre)

      };

      const accessTocken = await this.jwtService.sign(payload);

      return accessTocken;

    } catch (error) {
       
        if (error.code === 'ER_DUP_ENTRY') { // duplicate username
            throw new ConflictException('No fue posible actualizar el usuario');
        } else {
            throw new InternalServerErrorException();
        }
    }



  }

  async cambiarClaveMysql(user:UsuarioEntity, authCambioClaveDto : AuthCambioClaveDto){

    const { clave_anterior, password, repetir_clave} = authCambioClaveDto;

    const comparar_clave_anterior = await this.validatePassword(user.salt,user.password,clave_anterior);

    if(!comparar_clave_anterior){  

      throw new UnauthorizedException("Las clave anterior no coincide");
      
    }

    const comparar = this.compararPassword(password,repetir_clave);

    if(!comparar){  
  
        throw new UnauthorizedException("Las claves no coinciden");
        
    }

    user.salt = await bcrypt.genSalt(13);
    user.password = await this.hashPassword(password, user.salt);

    try {

        await this.usuarioRepository.save(user);

        const payload: JwtPayload = { 
          
          id: user.id,
          username:user.rut,
          email:user.email, 
          roles:user.roles.map( r => r.nombre)
        
        };

        const accessTocken = await this.jwtService.sign(payload);

        return accessTocken;

    } catch (error) {
       
        if (error.code === 'ER_DUP_ENTRY') { // duplicate username
            throw new ConflictException('No fue posible actualizar el usuario');
        } else {
            throw new InternalServerErrorException();
        }
    }



  }

  compararPassword(password:string,passwordRepetir:string): boolean{

    if(password === passwordRepetir){
        return true;
    }else{
        return false;
    }

  }

  private async hashPassword(password:string, salt: string): Promise<string> {

    return bcrypt.hash(password, salt);
    
  }

  async nuevaClave(user:Usuario, authNuevaClaveDto : AuthNuevaClaveDto) {

    const comparar = this.compararPassword(authNuevaClaveDto.password,authNuevaClaveDto.repetir_clave);

    if(!comparar){  

        throw new UnauthorizedException("Las claves no coinciden");
        
    }

    //const usuario = await this.userpdvRepository.findByUsername(username);

    user.salt = await bcrypt.genSalt(13);
    user.password = await this.hashPassword(authNuevaClaveDto.password, user.salt);

    try {

      const user2 =  await this.usuarioModule.findOneAndUpdate({ _id: user.id}, user);

      const payload: JwtPayload = { 

        id: user.id,
        username:user.rut,
        email:user.email, 
        roles:user.roles.map( r => r.nombre)

      };

      const accessTocken = await this.jwtService.sign(payload);

      return accessTocken;

    } catch (error) {
       
        if (error.code === 'ER_DUP_ENTRY') { // duplicate username
            throw new ConflictException('No fue posible actualizar el usuario');
        } else {
            throw new InternalServerErrorException();
        }
    }

  }

  async nuevaClaveMysql(user:UsuarioEntity, authNuevaClaveDto : AuthNuevaClaveDto) {

    const comparar = this.compararPassword(authNuevaClaveDto.password,authNuevaClaveDto.repetir_clave);

    if(!comparar){  

        throw new UnauthorizedException("Las claves no coinciden");
        
    }

    //const usuario = await this.userpdvRepository.findByUsername(username);

    user.salt = await bcrypt.genSalt(13);
    user.password = await this.hashPassword(authNuevaClaveDto.password, user.salt);

    try {

      await this.usuarioRepository.save(user);

      const payload: JwtPayload = { 

        id: user.id,
        username:user.rut,
        email:user.email, 
        roles:user.roles.map( r => r.nombre)
      
      };

      const accessTocken = await this.jwtService.sign(payload);

      return accessTocken;

    } catch (error) {
       
        if (error.code === 'ER_DUP_ENTRY') { // duplicate username
            throw new ConflictException('No fue posible actualizar el usuario');
        } else {
            throw new InternalServerErrorException();
        }
    }

  }

  async recuperarClave(authRecuperarClaveDto: AuthRecuperarClaveDto){

    const { username } = authRecuperarClaveDto;

    //console.log('recuperarClave service  username : ' + username);

    const user = await this.usuarioModule.findOne({ rut: username });

    //console.log(user);

    if(user === null){
        throw new BadRequestException('Usuario Invalido');
    }

    //console.log('recuperarClave service  activo : ' + user.activo);

    if(user.activo !== true){
        throw new BadRequestException('Usuario Inactivo');
    }

    const token = await this.signUser(  user.id, user.rut, user.email, user.roles.map( r => r.nombre)  );

    const nombreCompleto = user.nombre + " " + user.apellido_paterno;


    const urlRecuperarClave = `${this.config.get('SERVER')}recuperar-clave?token=${token}`;

    // const resipients = {
    //     "alumno": "nombre_alumno",
    //     "token": "token",
    //     "urlRecuperarClave": "urlRecuperarClave"

    // };

    // const resipients2 = {
    //     alumno: "nombre_alumno",
    //     token: "token",
    //     urlRecuperarClave: "urlRecuperarClave"

    // };

    const resipients3 = "{\"alumno\": \"" + nombreCompleto + "\",\"token\": \"" + token + "\",\"urlRecuperarClave\": \"" + urlRecuperarClave + "\"}";


    //const resipients4 = "{alumno: \"nombre_alumno\",token: \"token\",urlRecuperarClave: \"urlRecuperarClave\"}";
    


    const options: EmailOptions = {
        from: 'subenotas@preupdv.cl',
        to: user.email,
        subject: 'Recuperar Clave Sube Notas',
        template: 'password-recovery',
        'h:X-Mailgun-Variables': resipients3,

        

      };

    console.log(options);


    //await this.mailgunService.sendEmail(options);

    //console.log('recuperarClave server : ' + urlRecuperarClave);
    

  }

  async recuperarClaveMysql(authRecuperarClaveDto: AuthRecuperarClaveDto){

    const { username } = authRecuperarClaveDto;

    //console.log('recuperarClave service  username : ' + username);

    const user = await this.usuarioRepository.findOne({rut: username});

    //console.log(user);

    if(user === null){
        throw new BadRequestException('Usuario Invalido');
    }

    //console.log('recuperarClave service  activo : ' + user.activo);

    if(user.activo !== true){
        throw new BadRequestException('Usuario Inactivo');
    }

    const token = await this.signUser( user.id, user.rut, user.email, user.roles.map( r => r.nombre) );

    const nombreCompleto = user.nombre + " " + user.apellido_paterno;


    const urlRecuperarClave = `${this.config.get('SERVER')}recuperar-clave?token=${token}`;

    // const resipients = {
    //     "alumno": "nombre_alumno",
    //     "token": "token",
    //     "urlRecuperarClave": "urlRecuperarClave"

    // };

    // const resipients2 = {
    //     alumno: "nombre_alumno",
    //     token: "token",
    //     urlRecuperarClave: "urlRecuperarClave"

    // };

    const resipients3 = "{\"alumno\": \"" + nombreCompleto + "\",\"token\": \"" + token + "\",\"urlRecuperarClave\": \"" + urlRecuperarClave + "\"}";


    //const resipients4 = "{alumno: \"nombre_alumno\",token: \"token\",urlRecuperarClave: \"urlRecuperarClave\"}";
    


    const options: EmailOptions = {
        from: 'subenotas@preupdv.cl',
        to: user.email,
        subject: 'Recuperar Clave Sube Notas',
        template: 'password-recovery',
        'h:X-Mailgun-Variables': resipients3,

        

      };

    console.log(options);


    //await this.mailgunService.sendEmail(options);

    //console.log('recuperarClave server : ' + urlRecuperarClave);
    

  }

  async updateImagen(id:string,imagen:string) {

    const user = await this.usuarioModule.findOne({ _id: id });

    if(user){
      user.imagen = imagen;

      await user.save();

    }

  }

  async updateImagenMysql(id:string,imagen:string) {

    const user = await this.usuarioRepository.findOne({
      where: { id: id},
    });

    if(user){
      user.imagen = imagen;

      await this.usuarioRepository.save(user);

    }

  }

  async signUser(id : string ,rut : string, email : string ,roles : string[]){


    const payload: JwtPayload = { 

      id: id,
      username:rut,
      email:email, 
      roles:roles

    };

    const accessTocken = await this.jwtService.sign(payload);

    return accessTocken;
    

  }

}
