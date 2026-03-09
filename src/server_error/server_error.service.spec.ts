import { Test, TestingModule } from '@nestjs/testing';
import { ServerErrorService } from './server_error.service';

describe('ServerErrorService', () => {
  let service: ServerErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerErrorService],
    }).compile();

    service = module.get<ServerErrorService>(ServerErrorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
