import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';

import { KnowledgeBasesFilesuploadedService } from './knowledge_bases_filesuploaded.service';
import { CreateKnowledgeBasesFilesuploadedDto } from './dto/create-knowledge_bases_filesuploaded.dto';
import { UpdateKnowledgeBasesFilesuploadedDto } from './dto/update-knowledge_bases_filesuploaded.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth } from '../auth/decorator';

@Controller('knowledge-bases-filesuploaded')
@Auth()
export class KnowledgeBasesFilesuploadedController {
  constructor(private readonly knowledgeBasesFilesuploadedService: KnowledgeBasesFilesuploadedService) {}

  @Post()
  create(@Body() createKnowledgeBasesFilesuploadedDto: CreateKnowledgeBasesFilesuploadedDto) {
    return this.knowledgeBasesFilesuploadedService.create(createKnowledgeBasesFilesuploadedDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.knowledgeBasesFilesuploadedService.findAll( paginationDto );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.knowledgeBasesFilesuploadedService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateKnowledgeBasesFilesuploadedDto: UpdateKnowledgeBasesFilesuploadedDto) {
    return this.knowledgeBasesFilesuploadedService.update(id, updateKnowledgeBasesFilesuploadedDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.knowledgeBasesFilesuploadedService.remove(id);
  }
}
