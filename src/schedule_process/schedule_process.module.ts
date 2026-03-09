import { Module } from '@nestjs/common';
import { ScheduleProcessService } from './schedule_process.service';
import { ScheduleProcessController } from './schedule_process.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ServerErrorModule } from 'src/server_error/server_error.module';

@Module({
  imports: [ServerErrorModule, ScheduleModule.forRoot()],
  controllers: [ScheduleProcessController],
  providers: [ScheduleProcessService],
})
export class ScheduleProcessModule { }
