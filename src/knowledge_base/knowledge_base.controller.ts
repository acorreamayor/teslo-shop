import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { KnowledgeBaseService } from './knowledge_base.service';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge_base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge_base.dto';
import { Auth, GetUser } from '../auth/decorator';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { fileFilterGeneral } from '../files/helpers';

@Controller('knowledge-base')
@Auth()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  // carga de archivos a la base vectorial de una base de conocimiento
  @Post(':id/files')
  @UseInterceptors(
    FileInterceptor('file', { 
      fileFilter: fileFilterGeneral,
      storage: memoryStorage() // ⬅ Archivo en memoria
    })
  )
  async addFiles(
            @Param('id', ParseUUIDPipe) id: string,
            @UploadedFile() file: Express.Multer.File,
            @GetUser() user: User,
            ) {

    // Si pidieron validar imagen
    // if (validateImage === 'true') {
    //   if (!file.mimetype.startsWith('image/')) {
    //     throw new BadRequestException('El archivo debe ser una imagen');
    //   }
    // }

    const fileUploaded = await this.knowledgeBaseService.addFiles( id, user, file );
    
    return fileUploaded;

  }

  @Post()
  create(
    @Body() createKnowledgeBaseDto: CreateKnowledgeBaseDto,
    @GetUser() user: User
  ) {
    return this.knowledgeBaseService.create(createKnowledgeBaseDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.knowledgeBaseService.findAll( paginationDto, user );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string,  @GetUser() user: User) {
    return this.knowledgeBaseService.findOne(id, user);
  }

  @Patch(':id')
  update(
      @Param('id', ParseUUIDPipe) id: string, 
      @Body() updateKnowledgeBaseDto: UpdateKnowledgeBaseDto,
      @GetUser() user: User
    ) {
    return this.knowledgeBaseService.update(id, updateKnowledgeBaseDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.knowledgeBaseService.remove(id, user);
  }

}
