import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './app.swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.enableCors();

  initSwagger(app);

  // setDefaultUser(configService);

  app.useGlobalPipes(
    new ValidationPipe({
     transform: true,
     whitelist: true,
     forbidNonWhitelisted: true,
    })
  );


  await app.listen(port);

  logger.log(`Server is running in ${await app.getUrl()}`);
  
}
bootstrap();
