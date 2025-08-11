import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

  async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes( 
  //   new ValidationPipe({ 
  //   whitelist: true, 
  //   forbidNonWhitelisted: true, 

  //   transform: true,
  //   transformOptions: {
  //     exposeUnsetFields: false,
  //     enableImplicitConversion: true
  //   }
  //   }) 
  //  );

  app.setGlobalPrefix('api');
  
  const puerto = process.env.PORT ?? 3000;

  await app.listen(puerto);
  console.log(`App corriendo en el puerto ${ puerto }`);
}
bootstrap();
