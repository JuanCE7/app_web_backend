import { Test, TestingModule } from '@nestjs/testing';
import { EntrysController } from './entrys.controller';
import { EntrysService } from './entrys.service';

describe('EntrysController', () => {
  let controller: EntrysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntrysController],
      providers: [EntrysService],
    }).compile();

    controller = module.get<EntrysController>(EntrysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
