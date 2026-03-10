import { Module } from '@nestjs/common';
import { ScheduleProcessService } from './schedule_process.service';
import { ScheduleProcessController } from './schedule_process.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ServerErrorModule } from 'src/server_error/server_error.module';
import { SensorModule } from 'src/sensor/sensor.module';

@Module({
  imports: [ServerErrorModule, ScheduleModule.forRoot(), SensorModule],
  controllers: [ScheduleProcessController],
  providers: [ScheduleProcessService],
})
export class ScheduleProcessModule { }
