import { Injectable } from '@nestjs/common';
import { CreateDocumentUploadedDto } from './dto/create-document_uploaded.dto';
import { UpdateDocumentUploadedDto } from './dto/update-document_uploaded.dto';

@Injectable()
export class DocumentUploadedService {
  create(createDocumentUploadedDto: CreateDocumentUploadedDto) {
    return 'This action adds a new documentUploaded';
  }

  findAll() {
    return `This action returns all documentUploaded`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentUploaded`;
  }

  update(id: number, updateDocumentUploadedDto: UpdateDocumentUploadedDto) {
    return `This action updates a #${id} documentUploaded`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentUploaded`;
  }
}
