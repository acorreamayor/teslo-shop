import { PartialType } from '@nestjs/swagger';
import { CreateParameterToolDto } from './create-parameter_tool.dto';

export class UpdateParameterToolDto extends PartialType(CreateParameterToolDto) {}
