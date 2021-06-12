import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { hash } from 'bcryptjs';


const setDefaultUser = async (configService: ConfigService) => {
  
  const userRepository = getRepository<Usuario>(Usuario);
  //console.log(configService.get('DEFAULT_USER_EMAIL')); 


  const defaultUser = await userRepository
    .createQueryBuilder()
    .where('email = :email', {
      email: configService.get('DEFAULT_USER_EMAIL'),
    })
    .getOne();

  if (!defaultUser) {

    var Password = require("node-php-password");


    // este script lo saque de la siguiente página

    // https://github.com/thomas-alrek/node-php-password

    var options = {
      cost: 13,
   }
   // Valid algorithms are "PASSWORD_DEFAULT", and "PASSWORD_BCRYPT"
   // "PASSWORD_DEFAULT" is just an alias to "PASSWORD_BCRYPT", to be more
   // compatible with PHP
  //  var hash = Password.hash(configService.get('DEFAULT_USER_PASSWORD'), "PASSWORD_DEFAULT", options);

  //   const adminUser = userRepository.create({
  //     email: configService.get('DEFAULT_USER_EMAIL'),
  //     password: configService.get('DEFAULT_USER_PASSWORD'),
  //     password_yii: hash, 
  //     roles: ['ADMIN'],
  //   });

  //   return await userRepository.save(adminUser);
  }
};

export default setDefaultUser; 