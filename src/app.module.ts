import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';


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


    // TypeOrmModule.forRootAsync({
    //   name: 'mssqlConn', // Aquí sí defines el nombre
    //   useFactory: async () => ({
    //     type: 'mssql',
    //     host: 'PEE5AE2\\SQL2019',
    //     port: 1433,
    //     username: 'sainventario',
    //     password: 'zeustecinv',
    //     database: 'InventarioVsDesarrollo',
    //     synchronize: false,
    //     options: { encrypt: false },
    //   }),
    // }),    

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,

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
