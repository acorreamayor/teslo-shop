import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileUploadedService } from './file_uploaded.service';
import { CreateFileUploadedDto } from './dto/create-file_uploaded.dto';
import { UpdateFileUploadedDto } from './dto/update-file_uploaded.dto';

@Controller('file-uploaded')
export class FileUploadedController {
  constructor(private readonly fileUploadedService: FileUploadedService) {}

  @Post()
  create(@Body() createFileUploadedDto: CreateFileUploadedDto) {
    return this.fileUploadedService.create(createFileUploadedDto);
  }

  @Get()
  findAll() {
    return this.fileUploadedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileUploadedService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileUploadedDto: UpdateFileUploadedDto) {
    return this.fileUploadedService.update(+id, updateFileUploadedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileUploadedService.remove(+id);
  }
}
