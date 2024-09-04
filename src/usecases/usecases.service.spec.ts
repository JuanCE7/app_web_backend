import { Test, TestingModule } from '@nestjs/testing';
import { UsecasesService } from './usecases.service';

describe('UsecasesService', () => {
  let service: UsecasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsecasesService],
    }).compile();

    service = module.get<UsecasesService>(UsecasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
