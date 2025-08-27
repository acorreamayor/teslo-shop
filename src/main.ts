import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';


  async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // habilita todas las rutas
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes( 
    new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true, 

    transform: true,
    transformOptions: {
      exposeUnsetFields: false,
      enableImplicitConversion: true
    }
    }) 
   );

  //app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
  .setTitle('Teslo Restful API')
  .setDescription('Teslo shop endpoints')
  .setVersion('1.0')
  //.addTag('cats')
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);  
  
  const puerto = process.env.PORT ?? 3000;

  await app.listen(puerto);
  logger.log(`App corriendo en el puerto ${ puerto }`);
}
bootstrap();
