import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleProcessController } from './schedule_process.controller';
import { ScheduleProcessService } from './schedule_process.service';

describe('ScheduleProcessController', () => {
  let controller: ScheduleProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleProcessController],
      providers: [ScheduleProcessService],
    }).compile();

    controller = module.get<ScheduleProcessController>(ScheduleProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
