import { Test, TestingModule } from '@nestjs/testing';
import { EntrysService } from './entrys.service';

describe('EntrysService', () => {
  let service: EntrysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntrysService],
    }).compile();

    service = module.get<EntrysService>(EntrysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
