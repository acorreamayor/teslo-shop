import { Injectable } from '@nestjs/common';
import { CreateParameterUserDto } from './dto/create-parameter_user.dto';
import { UpdateParameterUserDto } from './dto/update-parameter_user.dto';

@Injectable()
export class ParameterUserService {
  create(createParameterUserDto: CreateParameterUserDto) {
    return 'This action adds a new parameterUser';
  }

  findAll() {
    return `This action returns all parameterUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parameterUser`;
  }

  update(id: number, updateParameterUserDto: UpdateParameterUserDto) {
    return `This action updates a #${id} parameterUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} parameterUser`;
  }
}
