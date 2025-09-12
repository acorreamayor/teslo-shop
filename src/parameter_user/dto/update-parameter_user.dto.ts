import { PartialType } from '@nestjs/swagger';
import { CreateParameterUserDto } from './create-parameter_user.dto';

export class UpdateParameterUserDto extends PartialType(CreateParameterUserDto) {}
