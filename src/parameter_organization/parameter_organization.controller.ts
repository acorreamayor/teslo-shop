import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParameterOrganizationService } from './parameter_organization.service';
import { CreateParameterOrganizationDto } from './dto/create-parameter_organization.dto';
import { UpdateParameterOrganizationDto } from './dto/update-parameter_organization.dto';

@Controller('parameter-organization')
export class ParameterOrganizationController {
  constructor(private readonly parameterOrganizationService: ParameterOrganizationService) {}

  @Post()
  create(@Body() createParameterOrganizationDto: CreateParameterOrganizationDto) {
    return this.parameterOrganizationService.create(createParameterOrganizationDto);
  }

  @Get()
  findAll() {
    return this.parameterOrganizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parameterOrganizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParameterOrganizationDto: UpdateParameterOrganizationDto) {
    return this.parameterOrganizationService.update(+id, updateParameterOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parameterOrganizationService.remove(+id);
  }
}
