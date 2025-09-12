import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParameterToolService } from './parameter_tool.service';
import { CreateParameterToolDto } from './dto/create-parameter_tool.dto';
import { UpdateParameterToolDto } from './dto/update-parameter_tool.dto';

@Controller('parameter-tool')
export class ParameterToolController {
  constructor(private readonly parameterToolService: ParameterToolService) {}

  @Post()
  create(@Body() createParameterToolDto: CreateParameterToolDto) {
    return this.parameterToolService.create(createParameterToolDto);
  }

  @Get()
  findAll() {
    return this.parameterToolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parameterToolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParameterToolDto: UpdateParameterToolDto) {
    return this.parameterToolService.update(+id, updateParameterToolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parameterToolService.remove(+id);
  }
}
