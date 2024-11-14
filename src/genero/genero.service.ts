
import { Injectable,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Genero} from "./genero.model";
import { Repository } from "typeorm";
import { GeneroDto } from "./dto/genero.dto";

@Injectable()
export class GeneroService {
    constructor(
        @InjectRepository(Genero)
        private generosRepository: Repository<Genero>,
    ) {}
    findAll(): Promise<Genero[]> {
        return this.generosRepository.find();
    }
    findById(id: number): Promise<Genero | null> {
        return this.generosRepository.findOneBy({ id });
    }
    creategenero(genero: Genero): Promise<Genero> {
        return this.generosRepository.save(genero);
    }
    async updateGenero(id: number, generoData: GeneroDto): Promise<Genero | null> {
        await this.generosRepository.update(id, generoData);
        return this.findById(id);
    }

    async updateGeneroPartial(id: number, generoData: Partial<GeneroDto>): Promise<Genero | null> {
        await this.generosRepository.update(id, generoData);
        return this.findById(id);
    }

    async deleteGenero(id: number): Promise<void> {
        await this.generosRepository.delete(id);
    }
    async getGeneroOr404(id: number): Promise<Genero> {
        const genero = await this.generosRepository.findOneBy({  id });
        if (!genero) {
          throw new NotFoundException(`Género con id ${id} no encontrado`);
        }
        return genero;
      }
}