import { Test, TestingModule } from '@nestjs/testing';
import { RolUsuarioController } from './rol-usuario.controller';
import { RolUsuarioService } from './rol-usuario.service';

describe('RolUsuarioController', () => {
  let controller: RolUsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolUsuarioController],
      providers: [RolUsuarioService],
    }).compile();

    controller = module.get<RolUsuarioController>(RolUsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
