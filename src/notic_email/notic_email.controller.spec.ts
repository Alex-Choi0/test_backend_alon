import { Test, TestingModule } from '@nestjs/testing';
import { NoticEmailController } from './notic_email.controller';
import { NoticEmailService } from './notic_email.service';

describe('NoticEmailController', () => {
  let controller: NoticEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticEmailController],
      providers: [NoticEmailService],
    }).compile();

    controller = module.get<NoticEmailController>(NoticEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
