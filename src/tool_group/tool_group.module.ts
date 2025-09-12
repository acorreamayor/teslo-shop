import { Module } from '@nestjs/common';
import { ToolGroupService } from './tool_group.service';
import { ToolGroupController } from './tool_group.controller';

@Module({
  controllers: [ToolGroupController],
  providers: [ToolGroupService],
})
export class ToolGroupModule {}
