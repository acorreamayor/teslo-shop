import { Injectable } from '@nestjs/common';
import { CreateParameterToolDto } from './dto/create-parameter_tool.dto';
import { UpdateParameterToolDto } from './dto/update-parameter_tool.dto';

@Injectable()
export class ParameterToolService {
  create(createParameterToolDto: CreateParameterToolDto) {
    return 'This action adds a new parameterTool';
  }

  findAll() {
    return `This action returns all parameterTool`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parameterTool`;
  }

  update(id: number, updateParameterToolDto: UpdateParameterToolDto) {
    return `This action updates a #${id} parameterTool`;
  }

  remove(id: number) {
    return `This action removes a #${id} parameterTool`;
  }
}
