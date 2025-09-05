import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileUploadedService } from './file_uploaded.service';
import { FileUploadedController } from './file_uploaded.controller';
import { FileUploaded } from './entities/file_uploaded.entity';

@Module({
  controllers: [FileUploadedController],
  providers: [FileUploadedService],
  imports: [
    TypeOrmModule.forFeature([ FileUploaded ]),
  ],
  exports: [
    FileUploadedService,
    TypeOrmModule,
  ]
})
export class FileUploadedModule {}
