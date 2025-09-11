import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res, Logger,  ParseUUIDPipe, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';
import { fileFilterGeneral } from './helpers';
import { Auth } from '../auth/decorator';  

@ApiTags('Files')
@Controller('files')
@Auth()
export class FilesController {

  private readonly logger = new Logger('ProductsService');

  constructor(
    private readonly filesService: FilesService,
  ) { }

  // carga de archivos a bucket de backblaze
  @Post()
  @UseInterceptors(
    FileInterceptor('file', { 
      fileFilter: fileFilterGeneral,
      storage: memoryStorage() // ⬅ Archivo en memoria
    })
  )
  async upload(
            @UploadedFile() file: Express.Multer.File,
            @Query('validateImage') validateImage?: string  // validateImage = 'true' si quiere validar imagenes
            ) {

    // Si pidieron validar imagen
    if (validateImage === 'true') {
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('El archivo debe ser una imagen');
      }
    }

    const fileUploaded = await this.filesService.upload( file );
    
    return fileUploaded;

  }

  // descarga de archivos desde bucket de backblaze
  @Get(':id')
  async getArchivo(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string
  ) {

    await this.filesService.getArchivo( res, id );
  }

  // descarga de solo imagenes desde bucket de backblaze
  @Get('image/:id')
  async getImagen(
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string
  ) {

    try  {

      await this.filesService.getArchivo( res, id, 'true' );

    } catch(error) {

      const path =  this.filesService.gerStaticImage('no-image.jpg');
      res.sendFile( path );

    }
    
  }

}
