import { PartialType } from '@nestjs/swagger';
import { CreateParameterUserOrganizationDto } from './create-parameter_user_organization.dto';

export class UpdateParameterUserOrganizationDto extends PartialType(CreateParameterUserOrganizationDto) {}
