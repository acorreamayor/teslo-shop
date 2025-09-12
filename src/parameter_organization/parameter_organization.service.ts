import { Injectable } from '@nestjs/common';
import { CreateParameterOrganizationDto } from './dto/create-parameter_organization.dto';
import { UpdateParameterOrganizationDto } from './dto/update-parameter_organization.dto';

@Injectable()
export class ParameterOrganizationService {
  create(createParameterOrganizationDto: CreateParameterOrganizationDto) {
    return 'This action adds a new parameterOrganization';
  }

  findAll() {
    return `This action returns all parameterOrganization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parameterOrganization`;
  }

  update(id: number, updateParameterOrganizationDto: UpdateParameterOrganizationDto) {
    return `This action updates a #${id} parameterOrganization`;
  }

  remove(id: number) {
    return `This action removes a #${id} parameterOrganization`;
  }
}
