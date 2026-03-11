import { Test, TestingModule } from '@nestjs/testing';
import { NoticEmailService } from './notic_email.service';

describe('NoticEmailService', () => {
  let service: NoticEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticEmailService],
    }).compile();

    service = module.get<NoticEmailService>(NoticEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
