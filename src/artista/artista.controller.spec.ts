import { Test, TestingModule } from '@nestjs/testing';
import { ArtistaController } from './Artista.controller';
import { ArtistaService } from './Artista.service';

describe('ArtistaController', () => {
  let controller: ArtistaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistaController],
      providers: [
        {
          provide: ArtistaService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            createArtista: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ArtistaController>(ArtistaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
