import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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

}
