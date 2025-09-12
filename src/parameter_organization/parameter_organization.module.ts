import { Module } from '@nestjs/common';
import { ParameterOrganizationService } from './parameter_organization.service';
import { ParameterOrganizationController } from './parameter_organization.controller';

@Module({
  controllers: [ParameterOrganizationController],
  providers: [ParameterOrganizationService],
})
export class ParameterOrganizationModule {}
