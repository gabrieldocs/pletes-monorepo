import { Test, TestingModule } from '@nestjs/testing';
import { ContainersController } from './containers.controller';
import { ContainersService } from './containers.service';

describe('ContainersController', () => {
  let controller: ContainersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContainersController],
      providers: [ContainersService],
    }).compile();

    controller = module.get<ContainersController>(ContainersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
