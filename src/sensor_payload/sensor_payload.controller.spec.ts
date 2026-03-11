import { Test, TestingModule } from '@nestjs/testing';
import { SensorPayloadController } from './sensor_payload.controller';
import { SensorPayloadService } from './sensor_payload.service';

describe('SensorPayloadController', () => {
  let controller: SensorPayloadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorPayloadController],
      providers: [SensorPayloadService],
    }).compile();

    controller = module.get<SensorPayloadController>(SensorPayloadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
