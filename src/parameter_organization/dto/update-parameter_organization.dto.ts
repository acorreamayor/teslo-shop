import { PartialType } from '@nestjs/swagger';
import { CreateParameterOrganizationDto } from './create-parameter_organization.dto';

export class UpdateParameterOrganizationDto extends PartialType(CreateParameterOrganizationDto) {}
