import { Test, TestingModule } from '@nestjs/testing';
import { cancionController } from './cancion.controller';
import { cancionService } from './cancion.service';

describe('cancionController', () => {
  let controller: cancionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [cancionController],
      providers: [
        {
          provide: cancionService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            createcancion: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<cancionController>(cancionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
