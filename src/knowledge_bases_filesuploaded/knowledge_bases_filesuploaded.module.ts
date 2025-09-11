import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBasesFilesuploaded } from './entities/knowledge_bases_filesuploaded.entity';
import { KnowledgeBasesFilesuploadedService } from './knowledge_bases_filesuploaded.service';
import { KnowledgeBasesFilesuploadedController } from './knowledge_bases_filesuploaded.controller';

@Module({
  controllers: [KnowledgeBasesFilesuploadedController],
  providers: [KnowledgeBasesFilesuploadedService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([KnowledgeBasesFilesuploaded]),
  ],
  exports: [TypeOrmModule, KnowledgeBasesFilesuploadedService],
})
export class KnowledgeBasesFilesuploadedModule {}
