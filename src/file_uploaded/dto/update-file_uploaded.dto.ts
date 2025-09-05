import { PartialType } from '@nestjs/swagger';
import { CreateFileUploadedDto } from './create-file_uploaded.dto';

export class UpdateFileUploadedDto extends PartialType(CreateFileUploadedDto) {}
