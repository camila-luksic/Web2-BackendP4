import { Injectable ,NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Album } from "./album.model";
import { Repository } from "typeorm";
import { ArtistaService } from '../artista/artista.service';
import { Artista } from '../artista/artista.model';
import { AlbumDto } from "./dto/album.dto";
@Injectable()
export class albumService {
    constructor(
        @InjectRepository(Album)
        private albumsRepository: Repository<Album>,
        private ArtistaService:ArtistaService
    ) {}
    findAll(): Promise<Album[]> {
        return this.albumsRepository.find();
    }
    findById(id: number): Promise<Album | null> {
        return this.albumsRepository.findOneBy({ id });
    }
    async createalbum(albumDto: AlbumDto): Promise<Album> {
        const artista = await this.ArtistaService.findById(albumDto.idArtista);

        if (!artista) {
            throw new Error('Artista not found');
        }
        const album = this.albumsRepository.create({
            nombre: albumDto.nombre,
            artista: artista,
        });

        return this.albumsRepository.save(album);
    }
    async updateAlbum(id: number, albumData: AlbumDto): Promise<Album | null> {

        const artista = await this.ArtistaService.findById(albumData.idArtista);

        if (!artista) {
            throw new Error('Artista not found');
        }
        await this.albumsRepository.update(id, {
            nombre: albumData.nombre,
            artista: artista,
        });
        return this.findById(id);
    }

    async updateAlbumPartial(id: number, albumData: Partial<AlbumDto>): Promise<Album | null> {
        await this.albumsRepository.update(id, albumData);
        return this.findById(id);
    }

    async deletealbum(id: number): Promise<void> {
        await this.albumsRepository.delete(id);
    }
    async getAlbumOr404(id: number): Promise<Album> {
        const album = await this.albumsRepository.findOneBy({  id });
        if (!album) {
             throw new NotFoundException(`Género con id ${id} no encontrado`);
        }
        return album;
      }
      async findAlbumbyArtista(idArtista: number): Promise<Album[]> {
        return this.albumsRepository.find({
            where: { artista: { id: idArtista } },
            relations: ['artista'],
        });
    }
}