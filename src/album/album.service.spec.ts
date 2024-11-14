import { Test, TestingModule } from '@nestjs/testing';
import { albumService } from './album.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Album } from './album.model';
import { ArtistaService } from '../artista/artista.service';
import { Repository } from 'typeorm';

describe('albumService', () => {
  let service: albumService;
  let repository: Repository<Album>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockArtistaService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    creategenero: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        albumService,
        {
          provide: getRepositoryToken(Album),
          useValue: mockRepository,
        },
        {
          provide: albumService,
          useValue: mockArtistaService,
        },
      ],
    }).compile();

    service = module.get<albumService>(albumService);
    repository = module.get<Repository<Album>>(getRepositoryToken(Album));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
