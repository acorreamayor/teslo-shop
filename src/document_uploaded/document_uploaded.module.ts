import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentUploadedService } from './document_uploaded.service';
import { DocumentUploadedController } from './document_uploaded.controller';
import { DocumentUploaded } from './entities/document_uploaded.entity';
import { FileUploadedModule } from '../file_uploaded/file_uploaded.module';

@Module({
  controllers: [DocumentUploadedController],
  providers: [DocumentUploadedService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([DocumentUploaded]),
    FileUploadedModule,
  ],
  exports: [DocumentUploadedService, TypeOrmModule]
})
export class DocumentUploadedModule {}
