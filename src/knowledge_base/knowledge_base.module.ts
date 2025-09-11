import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBaseService } from './knowledge_base.service';
import { KnowledgeBaseController } from './knowledge_base.controller';
import { KnowledgeBase } from './entities/knowledge_base.entity';
import { KnowledgeBasesFilesuploadedModule } from '../knowledge_bases_filesuploaded/knowledge_bases_filesuploaded.module';
import { FilesModule } from '../files/files.module';
import { DocumentUploadedModule } from '../document_uploaded/document_uploaded.module';

@Module({
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService],

  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([KnowledgeBase]),
    KnowledgeBasesFilesuploadedModule,
    FilesModule,
    DocumentUploadedModule,
  ],
  exports: [KnowledgeBaseService, TypeOrmModule]

})
export class KnowledgeBaseModule {}
