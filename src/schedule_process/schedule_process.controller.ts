import { Controller } from '@nestjs/common';
import { ScheduleProcessService } from './schedule_process.service';

@Controller('schedule-process')
export class ScheduleProcessController {
  constructor(private readonly scheduleProcessService: ScheduleProcessService) {}
}
