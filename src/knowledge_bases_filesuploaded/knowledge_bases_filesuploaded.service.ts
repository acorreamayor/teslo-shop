import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateKnowledgeBasesFilesuploadedDto } from './dto/create-knowledge_bases_filesuploaded.dto';
import { UpdateKnowledgeBasesFilesuploadedDto } from './dto/update-knowledge_bases_filesuploaded.dto';
import { KnowledgeBasesFilesuploaded } from './entities/knowledge_bases_filesuploaded.entity';
import { ShowError } from '../common/helpers';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KnowledgeBasesFilesuploadedService {

  private default_limit: number;

  constructor(
    @InjectRepository(KnowledgeBasesFilesuploaded)
    private readonly kbFilesRepo: Repository<KnowledgeBasesFilesuploaded>,
    private readonly configService: ConfigService,
  ) {
    this.default_limit = configService.get<number>('default_limit') || 10;
  }

  // CREATE
  async create(createDto: CreateKnowledgeBasesFilesuploadedDto) {
    try {

      const relation = this.kbFilesRepo.create({
        knowledgeBase: { id: createDto.knowledgeBaseId } as any,
        fileUploaded: { id: createDto.fileUploadedId } as any,
      });
  
      return await this.kbFilesRepo.save(relation);
  
    } catch(error) { ShowError(error); }
  }

  // READ ALL
  async findAll(paginationDto: PaginationDto) {

    const { limit = this.default_limit, offset = 0 } = paginationDto;

    return await this.kbFilesRepo.find({
      relations: ['knowledgeBase', 'fileUploaded'],
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  // READ ONE
  async findOne(id: string) {

    const relation = await this.kbFilesRepo.findOne({
      where: { id },
      relations: ['knowledgeBase', 'fileUploaded'],
    });

    if (!relation) {
      throw new NotFoundException(
        `Relación KnowledgeBasesFilesuploaded con id ${id} no fue encontrado`,
      );
    }

    return relation;
  }

  // UPDATE
  async update(
    id: string,
    updateDto: UpdateKnowledgeBasesFilesuploadedDto,
  ) {
    try {
      const relation = await this.findOne(id);

      if (updateDto.knowledgeBaseId) {
        relation.knowledgeBase = { id: updateDto.knowledgeBaseId } as any;
      }
      if (updateDto.fileUploadedId) {
        relation.fileUploaded = { id: updateDto.fileUploadedId } as any;
      }

      return await this.kbFilesRepo.save(relation);

    } catch(error) { ShowError(error); }
  }

  // DELETE
  async remove(id: string) {
    const relation = await this.findOne(id);

    try {

      return await this.kbFilesRepo.remove(relation);

    } catch(error) { ShowError(error); }  
  }

}
