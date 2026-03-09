import { Test, TestingModule } from '@nestjs/testing';
import { SensorPayloadService } from './sensor_payload.service';

describe('SensorPayloadService', () => {
  let service: SensorPayloadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorPayloadService],
    }).compile();

    service = module.get<SensorPayloadService>(SensorPayloadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
