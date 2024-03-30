import { Test, TestingModule } from '@nestjs/testing';
import { CompletitionsController } from './completitions.controller';
import { CompletitionsService } from './completitions.service';

describe('CompletitionsController', () => {
  let controller: CompletitionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompletitionsController],
      providers: [CompletitionsService],
    }).compile();

    controller = module.get<CompletitionsController>(CompletitionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
