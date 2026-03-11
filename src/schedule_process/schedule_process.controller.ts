import { Controller } from '@nestjs/common';
import { ScheduleProcessService } from './schedule_process.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('스케줄 API')
@Controller('schedule-process')
export class ScheduleProcessController {
  constructor(private readonly scheduleProcessService: ScheduleProcessService) { }
}
