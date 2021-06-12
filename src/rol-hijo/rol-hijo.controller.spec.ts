import { Test, TestingModule } from '@nestjs/testing';
import { RolHijoController } from './rol-hijo.controller';
import { RolHijoService } from './rol-hijo.service';

describe('RolHijoController', () => {
  let controller: RolHijoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolHijoController],
      providers: [RolHijoService],
    }).compile();

    controller = module.get<RolHijoController>(RolHijoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
