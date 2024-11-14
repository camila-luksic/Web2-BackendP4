import { Test, TestingModule } from '@nestjs/testing';
import { GeneroService } from './genero.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genero } from './genero.model';
import { Repository } from 'typeorm';

describe('GeneroService', () => {
  let service: GeneroService;
  let repository: Repository<Genero>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneroService,
        {
          provide: getRepositoryToken(Genero),
          useClass: Repository, 
        },
      ],
    }).compile();

    service = module.get<GeneroService>(GeneroService);
    repository = module.get<Repository<Genero>>(getRepositoryToken(Genero));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
