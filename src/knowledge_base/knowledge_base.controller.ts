import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';

import { KnowledgeBaseService } from './knowledge_base.service';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge_base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge_base.dto';
import { Auth, GetUser } from '../auth/decorator';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('knowledge-base')
@Auth()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

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
