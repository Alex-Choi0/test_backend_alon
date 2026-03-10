import { Test, TestingModule } from '@nestjs/testing';
import { SensorErrorService } from './sensor_error.service';

describe('SensorErrorService', () => {
  let service: SensorErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorErrorService],
    }).compile();

    service = module.get<SensorErrorService>(SensorErrorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
