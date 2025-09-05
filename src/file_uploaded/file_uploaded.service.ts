import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFileUploadedDto } from './dto/create-file_uploaded.dto';
import { UpdateFileUploadedDto } from './dto/update-file_uploaded.dto';
import { FileUploaded } from './entities/file_uploaded.entity';

@Injectable()
export class FileUploadedService {

  private readonly logger = new Logger('FileUploadedService');

  constructor(
    @InjectRepository(FileUploaded)
    private readonly fileUploadedRepository: Repository<FileUploaded>,
    
  ) {}

  async create(createFileUploadedDto: CreateFileUploadedDto) {
    try {

      let fileUploaded = this.fileUploadedRepository.create(createFileUploadedDto);
      
      fileUploaded = await this.fileUploadedRepository.save(fileUploaded);

      return fileUploaded;

    } catch(error) {
      this.handleExceptions(error);
    }    
  }

  findAll() {
    return `This action returns all fileUploaded`;
  }

  async findOne(id: string) {

    const fileUploaded = await this.fileUploadedRepository.findOne({ where: [ { id:id } ]  });

      if (!fileUploaded)
        throw new NotFoundException(`Archivo con id ${ id } no fue encontrado`);

      return fileUploaded;

    }

  update(id: number, updateFileUploadedDto: UpdateFileUploadedDto) {
    return `This action updates a #${id} fileUploaded`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileUploaded`;
  }

  private handleExceptions( error: any ) {
    this.logger.error(error);

    if (error.detail)
      throw new BadRequestException(error.detail);

    if (error.where)
      throw new BadRequestException(error.where);

    throw new InternalServerErrorException(error);
  }

}
