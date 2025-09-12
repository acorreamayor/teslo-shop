import { Injectable } from '@nestjs/common';
import { CreateParameterUserOrganizationDto } from './dto/create-parameter_user_organization.dto';
import { UpdateParameterUserOrganizationDto } from './dto/update-parameter_user_organization.dto';

@Injectable()
export class ParameterUserOrganizationService {
  create(createParameterUserOrganizationDto: CreateParameterUserOrganizationDto) {
    return 'This action adds a new parameterUserOrganization';
  }

  findAll() {
    return `This action returns all parameterUserOrganization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parameterUserOrganization`;
  }

  update(id: number, updateParameterUserOrganizationDto: UpdateParameterUserOrganizationDto) {
    return `This action updates a #${id} parameterUserOrganization`;
  }

  remove(id: number) {
    return `This action removes a #${id} parameterUserOrganization`;
  }
}
