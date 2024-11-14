import { Test, TestingModule } from '@nestjs/testing';
import { GeneroController } from './genero.controller';
import { GeneroService } from './genero.service';

describe('GeneroController', () => {
  let controller: GeneroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneroController],
      providers: [
        {
          provide: GeneroService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            creategenero: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GeneroController>(GeneroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
