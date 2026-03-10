import { Test, TestingModule } from '@nestjs/testing';
import { SensorErrorController } from './sensor_error.controller';
import { SensorErrorService } from './sensor_error.service';

describe('SensorErrorController', () => {
  let controller: SensorErrorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorErrorController],
      providers: [SensorErrorService],
    }).compile();

    controller = module.get<SensorErrorController>(SensorErrorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
