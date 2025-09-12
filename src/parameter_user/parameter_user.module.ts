import { Module } from '@nestjs/common';
import { ParameterUserService } from './parameter_user.service';
import { ParameterUserController } from './parameter_user.controller';

@Module({
  controllers: [ParameterUserController],
  providers: [ParameterUserService],
})
export class ParameterUserModule {}
