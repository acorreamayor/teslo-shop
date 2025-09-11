import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateKnowledgeBaseDto } from './dto/create-knowledge_base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge_base.dto';
import { User } from '../auth/entities/user.entity';
import { ShowError } from '../common/helpers';
import { KnowledgeBase } from './entities/knowledge_base.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../files/files.service';
import { KnowledgeBasesFilesuploadedService } from '../knowledge_bases_filesuploaded/knowledge_bases_filesuploaded.service';
import { DocumentUploadedService } from '../document_uploaded/document_uploaded.service';

@Injectable()
export class KnowledgeBaseService {

  private default_limit: number;

  constructor(
        @InjectRepository(KnowledgeBase)
        private readonly knowledgeBaseRepository: Repository<KnowledgeBase>,
        private readonly filesService: FilesService,
        private readonly knowledgeBasesFilesuploadedService: KnowledgeBasesFilesuploadedService,
        private readonly documentUploadedService: DocumentUploadedService,

        private readonly configService: ConfigService,
        
  ) {
    this.default_limit = configService.get<number>('default_limit') || 10;
  }


  async create(createKnowledgeBaseDto: CreateKnowledgeBaseDto, user: User) {
    try {

      const knowledgeBase = this.knowledgeBaseRepository.create({
        ...createKnowledgeBaseDto,
        user: user
      });
      await this.knowledgeBaseRepository.save(knowledgeBase);

      return knowledgeBase;

    } catch(error) {

      ShowError(error);

    }

  }

  async findAll(paginationDto: PaginationDto, user: User) {
      const { limit = this.default_limit, offset = 0 } = paginationDto;

      const knowledgeBases = await this.knowledgeBaseRepository.find({
        where: {  user: { id: user.id } },
        skip: offset,
        take: limit,
        relations: {
          user: true
        },
        order: { title: 'DESC' },

      });

    return knowledgeBases;
  }

  async findOne(id: string, user: User) {
    const knowledgeBase = await this.knowledgeBaseRepository.findOne({ 
      where: [{ id:id, user: { id: user.id } }],
      relations: {
        user: true
      }
    });

    if (!knowledgeBase)
      throw new NotFoundException(`Base de conocimiento con id ${ id } no fue encontrado`);

    return knowledgeBase;

  }

  async update(id: string, updateKnowledgeBaseDto: UpdateKnowledgeBaseDto, user: User) {
    try {

      const { user: userOwner  } = await this.findOne(id, user);

      let knowledgeBase = await this.knowledgeBaseRepository.preload({ 
        id: id, 
        ...updateKnowledgeBaseDto,
      });

      if (!knowledgeBase)
        throw new NotFoundException(`Base de conocimiento con id ${ id } no fue encontrado`);

      if (userOwner?.id !== user.id)
        throw new NotFoundException(`Usted no es el dueño de esta base de conocimiento`);

      await this.knowledgeBaseRepository.save( knowledgeBase );

      return knowledgeBase;
      
    } catch(error) { ShowError(error); }
  }

  async remove(id: string, user: User) {
    await this.findOne(id, user);

    try {

      await this.knowledgeBaseRepository.delete({ id: id });

    } catch(error) {
      ShowError(error);
    }  
  }

  async addFiles(id: string, user: User, file: Express.Multer.File) {

    try {

      const knowledgeBase = await this.findOne(id, user);
      const fileUploaded = await this.filesService.upload( file );

      if( !fileUploaded )
          throw new NotFoundException(`No fue posible subir el archivo`);

      const aaa = await this.documentUploadedService.addFiles(fileUploaded, file);
      console.log(aaa);

      return await this.knowledgeBasesFilesuploadedService.create({
        knowledgeBaseId: knowledgeBase.id,
        fileUploadedId: fileUploaded.id
      });
    
    } catch(error) { ShowError(error); }

  }


}
