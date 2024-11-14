import { Test, TestingModule } from '@nestjs/testing';
import { cancionService } from '../cancion/cancion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cancion } from '../cancion/cancion.model';
import { albumService } from '../album/album.service';
import { Repository } from 'typeorm';
import { Artista } from '../artista/artista.model';
import { Album } from '../album/album.model';
describe('cancionService', () => {
  let service: cancionService;
  let repository: Repository<Cancion>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAlbumService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    creategenero: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        cancionService,
        {
          provide: getRepositoryToken(Cancion),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Artista),
          useClass: Repository,
      },
      {
          provide: getRepositoryToken(Album),
          useClass: Repository,
      },
        {
          provide: albumService,
          useValue: mockAlbumService,
        },
      ],
    }).compile();

    service = module.get<cancionService>(cancionService);
    repository = module.get<Repository<Cancion>>(getRepositoryToken(Cancion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
