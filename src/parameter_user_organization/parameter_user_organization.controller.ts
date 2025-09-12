import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParameterUserOrganizationService } from './parameter_user_organization.service';
import { CreateParameterUserOrganizationDto } from './dto/create-parameter_user_organization.dto';
import { UpdateParameterUserOrganizationDto } from './dto/update-parameter_user_organization.dto';

@Controller('parameter-user-organization')
export class ParameterUserOrganizationController {
  constructor(private readonly parameterUserOrganizationService: ParameterUserOrganizationService) {}

  @Post()
  create(@Body() createParameterUserOrganizationDto: CreateParameterUserOrganizationDto) {
    return this.parameterUserOrganizationService.create(createParameterUserOrganizationDto);
  }

  @Get()
  findAll() {
    return this.parameterUserOrganizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parameterUserOrganizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParameterUserOrganizationDto: UpdateParameterUserOrganizationDto) {
    return this.parameterUserOrganizationService.update(+id, updateParameterUserOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parameterUserOrganizationService.remove(+id);
  }
}
