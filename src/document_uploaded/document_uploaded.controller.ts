import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentUploadedService } from './document_uploaded.service';
import { CreateDocumentUploadedDto } from './dto/create-document_uploaded.dto';
import { UpdateDocumentUploadedDto } from './dto/update-document_uploaded.dto';

@Controller('document-uploaded')
export class DocumentUploadedController {
  constructor(private readonly documentUploadedService: DocumentUploadedService) {}

  @Post()
  create(@Body() createDocumentUploadedDto: CreateDocumentUploadedDto) {
    return this.documentUploadedService.create(createDocumentUploadedDto);
  }

  @Get()
  findAll() {
    return this.documentUploadedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentUploadedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentUploadedDto: UpdateDocumentUploadedDto) {
    return this.documentUploadedService.update(+id, updateDocumentUploadedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentUploadedService.remove(+id);
  }
}
