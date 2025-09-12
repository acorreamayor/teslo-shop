import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToolGroupService } from './tool_group.service';
import { CreateToolGroupDto } from './dto/create-tool_group.dto';
import { UpdateToolGroupDto } from './dto/update-tool_group.dto';

@Controller('tool-group')
export class ToolGroupController {
  constructor(private readonly toolGroupService: ToolGroupService) {}

  @Post()
  create(@Body() createToolGroupDto: CreateToolGroupDto) {
    return this.toolGroupService.create(createToolGroupDto);
  }

  @Get()
  findAll() {
    return this.toolGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolGroupDto: UpdateToolGroupDto) {
    return this.toolGroupService.update(+id, updateToolGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolGroupService.remove(+id);
  }
}
