import { Test, TestingModule } from '@nestjs/testing';
import { RolHijoService } from './rol-hijo.service';

describe('RolHijoService', () => {
  let service: RolHijoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolHijoService],
    }).compile();

    service = module.get<RolHijoService>(RolHijoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
