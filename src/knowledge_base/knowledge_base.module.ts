import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KnowledgeBaseService } from './knowledge_base.service';
import { KnowledgeBaseController } from './knowledge_base.controller';
import { KnowledgeBase } from './entities/knowledge_base.entity';

@Module({
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService],

  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([KnowledgeBase])
    //AuthModule
  ],
  exports: [KnowledgeBaseService, TypeOrmModule]

})
export class KnowledgeBaseModule {}
