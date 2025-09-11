
import { IsUUID } from 'class-validator';

export class CreateKnowledgeBasesFilesuploadedDto {
    @IsUUID()
    knowledgeBaseId: string;
  
    @IsUUID()
    fileUploadedId: string;
}
