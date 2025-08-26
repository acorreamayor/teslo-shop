import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res, Logger, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { Response } from 'express';
import B2 = require('backblaze-b2');
import axios from 'axios';

import { FilesService } from './files.service';
import { fileFilter, fileNamer, fileFilterGeneral, nombreNuevoUnico } from './helpers';
import { Auth } from 'src/auth/decorator';


@Controller('files')
@Auth()
export class FilesController {

  private b2: B2;
  private readonly logger = new Logger('ProductsService');

  constructor(
    private readonly filesService: FilesService,
  ) {

    this.b2 = new B2({
      applicationKeyId: this.filesService.b2_application_key_id, // accountId
      applicationKey: this.filesService.b2_application_key,     // applicationKey
    });    

  }

  @Get('products/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path =  this.filesService.gerStaticImage(imageName);

    
    res.sendFile( path );
  }
  
  @Post('products')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter
    // , limits: { fileSize: 1000 }
    , storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }) )
  uploadProductImage( @UploadedFile() file: Express.Multer.File ) {
    
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }


    const secureUrl = `${ this.filesService.host_api }/files/products/${ file.filename }`

    return { secureUrl };
  }


  // carga de archivos a bucket de backblaze
  @Post()
  @UseInterceptors(
    FileInterceptor('file', { 
      fileFilter: fileFilterGeneral,
      storage: memoryStorage() // ⬅ Archivo en memoria
    })
  )
  async upload(@UploadedFile() file: Express.Multer.File) {

    if( this.filesService.file_storage_provider === 'NINGUNO' ) {
      throw new BadRequestException('No ha configurado un proveedor de carga de archivos.');
    }

    if (!file) {
      throw new BadRequestException('Make sure that the file is valid');
    }

    // 1️⃣ Autenticar con Backblaze
    await this.b2.authorize();

    // 2️⃣ Obtener la URL de subida del bucket
    const bucketName = this.filesService.b2_bucket_name;
    const { data: bucketData } = await this.b2.getBucket({ bucketName });
    const bucketId = bucketData.buckets[0].bucketId;

    const { data: uploadData } = await this.b2.getUploadUrl({ bucketId });

    // 3️⃣ Generar nombre único y subir el archivo desde buffer
    const newFileName = nombreNuevoUnico(file.originalname);

    await this.b2.uploadFile({
      uploadUrl: uploadData.uploadUrl,
      uploadAuthToken: uploadData.authorizationToken,
      fileName: newFileName,
      data: file.buffer, // ⬅ Usamos el buffer directamente
      mime: file.mimetype,
    });

    // 4️⃣ Generar URL pública
    const publicUrl = `${ this.filesService.b2_bucket_url }/${ newFileName }`;

    return { 
      original: file.originalname,
      uploadedAs: newFileName,
      url: publicUrl 
    };
  }

  // descarga de archivos desde bucket de backblaze
  @Get(':nombreArchivo')
  async getProductImage(
    @Res() res: Response,
    @Param('nombreArchivo') nombreArchivo: string
  ) {

    try {

      if( this.filesService.file_storage_provider === 'NINGUNO' ) {
        throw new BadRequestException('No ha configurado un proveedor de carga de archivos.');
      }
  
      if (!nombreArchivo) {
        throw new BadRequestException('Image name is required');
      }
  
      // 1️⃣ Autorizar
      await this.b2.authorize();
  
      // 2️⃣ Obtener bucketId
      const bucketName = this.filesService.b2_bucket_name;
      const { data: bucketData } = await this.b2.getBucket({ bucketName });
      const bucketId = bucketData.buckets[0].bucketId;
  
      // 3️⃣ Generar autorización de descarga para ese archivo
      const { data: authData } = await this.b2.getDownloadAuthorization({
        bucketId,
        fileNamePrefix: nombreArchivo,
        validDurationInSeconds: 60 // válido por 1 minuto
      });
  
  
      // 4️⃣ Construir URL temporal
      const downloadUrl = `${ this.filesService.b2_download_base_url }/file/${bucketName}/${nombreArchivo}?Authorization=${authData.authorizationToken}`;
  
      // 5️⃣ Descargar el archivo y enviarlo como stream
      const fileStream = await axios.get(downloadUrl, { responseType: 'stream' });
      res.setHeader('Content-Type', fileStream.headers['content-type'] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
  
      fileStream.data.pipe(res);
  
    } catch(error) {
      this.handleExceptions(error);
    }

  }

  private handleExceptions( error: any ) {
      this.logger.error(error);
  
      if (error.detail)
        throw new BadRequestException(error.detail);
  
      if (error.where)
        throw new BadRequestException(error.where);
  
      throw new InternalServerErrorException(error);
  }

}
