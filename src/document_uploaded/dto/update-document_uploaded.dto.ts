import { PartialType } from '@nestjs/swagger';
import { CreateDocumentUploadedDto } from './create-document_uploaded.dto';

export class UpdateDocumentUploadedDto extends PartialType(CreateDocumentUploadedDto) {}
