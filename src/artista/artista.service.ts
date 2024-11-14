import { Injectable,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Artista } from './artista.model';
import { Repository } from "typeorm";
import { GeneroService } from "../genero/genero.service";
import { ArtistaDto } from "./dto/artista.dto";

@Injectable()
export class ArtistaService {
    constructor(
        @InjectRepository(Artista)
        private artistasRepository: Repository<Artista>,

        private generoService: GeneroService
    ) {}
    findAll(): Promise<Artista[]> {
        return this.artistasRepository.find();
    }
    findById(id: number): Promise<Artista | null> {
        return this.artistasRepository.findOneBy({ id });
    }

    async createartista(artistaDto: ArtistaDto): Promise<Artista> {

        const genero = await this.generoService.findById(artistaDto.idGenero);

        if (!genero) {
            throw new Error('Genero not found');
        }


        const artista = this.artistasRepository.create({
            nombre: artistaDto.nombre,
            genero: genero,
        });

        return this.artistasRepository.save(artista);
    }
    async updateArtista(id: number, artistaData: ArtistaDto): Promise<Artista | null> {

        const genero = await this.generoService.findById(artistaData.idGenero);

        if (!genero) {
            throw new Error('Genero not found');
        }
    
        await this.artistasRepository.update(id, {
            nombre: artistaData.nombre,
            genero: genero,
        });
    
        return this.findById(id);
    }
    

    async updateArtistaPartial(id: number, artistaData: Partial<ArtistaDto>): Promise<Artista | null> {
        await this.artistasRepository.update(id, artistaData);
        return this.findById(id);
    }

    async deleteArtista(id: number): Promise<void> {
        await this.artistasRepository.delete(id);
    }
    async getArtistaOr404(id: number): Promise<Artista> {
        const artista = await this.artistasRepository.findOneBy({  id });
        if (!artista) {
          throw new NotFoundException(`Artistas con id ${id} no encontrado`);
        }
        return artista;
      }
      async findArtistasByGenero(idGenero: number): Promise<Artista[]> {
        return this.artistasRepository.find({
            where: { genero: { id: idGenero } },
            relations: ['genero'], 
        });
    }
}
