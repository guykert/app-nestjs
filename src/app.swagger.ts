import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const initSwagger = (app: INestApplication) => {
  
  const configService = app.get(ConfigService);
  const server = configService.get('SERVER');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sistema Desarrollo CSV ...')
    .addBearerAuth()
    .setVersion('1.0.0')
    .setDescription(
      'Esta es una API Creada con NestJS por Claudio Santibañez.',
    )
    .addServer(`${server}`)
    .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig,{
    ignoreGlobalPrefix: false,
  });
  
  SwaggerModule.setup('/docs', app, document,{
    explorer : true,
    swaggerOptions:{
      filter : true,
      showRequestDuration : true
    }
  });
};