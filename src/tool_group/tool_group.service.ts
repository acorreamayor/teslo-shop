import { Injectable } from '@nestjs/common';
import { CreateToolGroupDto } from './dto/create-tool_group.dto';
import { UpdateToolGroupDto } from './dto/update-tool_group.dto';

@Injectable()
export class ToolGroupService {
  create(createToolGroupDto: CreateToolGroupDto) {
    return 'This action adds a new toolGroup';
  }

  findAll() {
    return `This action returns all toolGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toolGroup`;
  }

  update(id: number, updateToolGroupDto: UpdateToolGroupDto) {
    return `This action updates a #${id} toolGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} toolGroup`;
  }
}
