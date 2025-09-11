import { PartialType } from '@nestjs/swagger';
import { CreateKnowledgeBasesFilesuploadedDto } from './create-knowledge_bases_filesuploaded.dto';

export class UpdateKnowledgeBasesFilesuploadedDto extends PartialType(CreateKnowledgeBasesFilesuploadedDto) {}
