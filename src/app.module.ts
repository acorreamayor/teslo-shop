import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,  // OJO esto es para generar estructuras
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ProductsModule,


  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    // console.log('HOST: ', process.env.DB_HOST);
    // console.log('PORT: ', process.env.DB_PORT);
    // console.log('DB_NAME: ', process.env.DB_NAME);
    // console.log('DB_USERNAME: ', process.env.DB_USERNAME);
  }
  
  
}
