import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cancion } from "./cancion.model";
import { Repository,Like } from "typeorm";
import { albumService } from '../album/album.service';
import { CancionDto } from "./dto/cancion.dto";
import { existsSync, mkdirSync } from "fs";
import { Artista } from "../artista/artista.model";
import { Album } from "../album/album.model";
@Injectable()
export class cancionService {
    constructor(
        @InjectRepository(Cancion)
        private cancionsRepository: Repository<Cancion>,
        private albumService: albumService,
        @InjectRepository(Artista)
        private artistaRepository: Repository<Artista>,
        @InjectRepository(Album)
        private albumRepository: Repository<Album>
    ) {}
    findAll(): Promise<Cancion[]> {
        return this.cancionsRepository.find();
    }
    findById(id: number): Promise<Cancion | null> {
        return this.cancionsRepository.findOneBy({ id });
    }
    async createcancion(cancionDto: CancionDto): Promise<Cancion> {

        const album = await this.albumService.findById(cancionDto.idAlbum);

        if (!album) {
            throw new Error('album not found');
        }

        const cancion = this.cancionsRepository.create({
            nombre: cancionDto.nombre,
            album: album,
        });

        return this.cancionsRepository.save(cancion);
    }
    async updatecancion(id: number, cancionData: CancionDto): Promise<Cancion | null> {

        const album= await this.albumService.findById(cancionData.idAlbum);

        if (!album) {
            throw new Error('Album not found');
        }
        await this.cancionsRepository.update(id, {
            nombre: cancionData.nombre,
            album:album
        });
        return this.findById(id);
    }

    async updatecancionPartial(id: number, cancionData: Partial<CancionDto>): Promise<Cancion | null> {
        await this.cancionsRepository.update(id, cancionData);
        return this.findById(id);
    }

    async deletecancion(id: number): Promise<void> {
        await this.cancionsRepository.delete(id);
    }
    async findCancionbyAlbum(idAlbum: number): Promise<Cancion[]> {
        return this.cancionsRepository.find({
            where: { album: { id: idAlbum } },
            relations: ['album'],
        });
    }
    async saveFile(file: Express.Multer.File, id: number): Promise<string> {
        const uploadPath = "/public/canciones"

        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
        }

        const filePath = uploadPath+ `${id}.mp3`;

        const fs = require("fs");
        fs.writeFileSync(filePath, file.buffer);

        return `Archivo guardado en ${filePath}`;
    }

    async search(query: string) {
        console.log("Buscando con el query:", query);
        const canciones = await this.cancionsRepository.find({
            where: { nombre: Like(`%${query}%`) },
            relations: ['album'],
        });
        console.log("Canciones encontradas:", canciones);
        const albums = await this.albumRepository.find({
            where: { nombre: Like(`%${query}%`) },
            relations: ['artista'],
        });
        console.log("Álbumes encontrados:", albums);
        const artistas = await this.artistaRepository.find({
            where: { nombre: Like(`%${query}%`) },
        });
        console.log("Artistas encontrados:", artistas);
        return {
            canciones,
            artistas,
            albums
        };
    }

}