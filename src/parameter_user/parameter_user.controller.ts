import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParameterUserService } from './parameter_user.service';
import { CreateParameterUserDto } from './dto/create-parameter_user.dto';
import { UpdateParameterUserDto } from './dto/update-parameter_user.dto';

@Controller('parameter-user')
export class ParameterUserController {
  constructor(private readonly parameterUserService: ParameterUserService) {}

  @Post()
  create(@Body() createParameterUserDto: CreateParameterUserDto) {
    return this.parameterUserService.create(createParameterUserDto);
  }

  @Get()
  findAll() {
    return this.parameterUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parameterUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParameterUserDto: UpdateParameterUserDto) {
    return this.parameterUserService.update(+id, updateParameterUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parameterUserService.remove(+id);
  }
}
