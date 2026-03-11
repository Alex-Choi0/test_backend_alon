import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleProcessService } from './schedule_process.service';

describe('ScheduleProcessService', () => {
  let service: ScheduleProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleProcessService],
    }).compile();

    service = module.get<ScheduleProcessService>(ScheduleProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
