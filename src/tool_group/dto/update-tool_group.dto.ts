import { PartialType } from '@nestjs/swagger';
import { CreateToolGroupDto } from './create-tool_group.dto';

export class UpdateToolGroupDto extends PartialType(CreateToolGroupDto) {}
