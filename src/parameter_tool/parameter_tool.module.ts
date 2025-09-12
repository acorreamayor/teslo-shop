import { Module } from '@nestjs/common';
import { ParameterToolService } from './parameter_tool.service';
import { ParameterToolController } from './parameter_tool.controller';

@Module({
  controllers: [ParameterToolController],
  providers: [ParameterToolService],
})
export class ParameterToolModule {}
