import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileUploadedModule } from 'src/file_uploaded/file_uploaded.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule,
    FileUploadedModule, 
    AuthModule
    
  ]
})
export class FilesModule {}
