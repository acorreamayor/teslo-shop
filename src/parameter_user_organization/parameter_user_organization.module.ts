import { Module } from '@nestjs/common';
import { ParameterUserOrganizationService } from './parameter_user_organization.service';
import { ParameterUserOrganizationController } from './parameter_user_organization.controller';

@Module({
  controllers: [ParameterUserOrganizationController],
  providers: [ParameterUserOrganizationService],
})
export class ParameterUserOrganizationModule {}
