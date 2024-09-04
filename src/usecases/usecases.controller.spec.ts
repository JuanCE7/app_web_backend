import { Test, TestingModule } from '@nestjs/testing';
import { UsecasesController } from './usecases.controller';
import { UsecasesService } from './usecases.service';

describe('UsecasesController', () => {
  let controller: UsecasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsecasesController],
      providers: [UsecasesService],
    }).compile();

    controller = module.get<UsecasesController>(UsecasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
