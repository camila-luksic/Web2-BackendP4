import { Test, TestingModule } from '@nestjs/testing';
import { AlbumController } from './album.controller';
import { albumService } from './album.service';

describe('albumController', () => {
  let controller: AlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumController],
      providers: [
        {
          provide: albumService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            createalbum: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AlbumController>(AlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
