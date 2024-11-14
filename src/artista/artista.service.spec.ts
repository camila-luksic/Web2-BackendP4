import { Test, TestingModule } from '@nestjs/testing';
import { ArtistaService } from './artista.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Artista } from './artista.model';
import { GeneroService } from '../genero/genero.service';
import { Repository } from 'typeorm';

describe('ArtistaService', () => {
  let service: ArtistaService;
  let repository: Repository<Artista>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockGeneroService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    creategenero: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistaService,
        {
          provide: getRepositoryToken(Artista),
          useValue: mockRepository,
        },
        {
          provide: GeneroService,
          useValue: mockGeneroService,
        },
      ],
    }).compile();

    service = module.get<ArtistaService>(ArtistaService);
    repository = module.get<Repository<Artista>>(getRepositoryToken(Artista));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
