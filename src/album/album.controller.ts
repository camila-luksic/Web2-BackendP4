import { Body, Controller, Delete, Get, Param, Patch, Post, Put , UseInterceptors, UploadedFile,NotFoundException } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { promises as fsPromises } from 'fs';
import { albumService } from "./album.service";
import { Album } from "./album.model";
import { AlbumDto } from "./dto/album.dto";
import { join } from 'path';
@Controller('album')
export class AlbumController {
    constructor(
        private albumsService: albumService
    ) {}
    @Get()
    list(): Promise<Album[]> {
        return this.albumsService.findAll();
    }
    @Get(":id")
    get(@Param("id") id: number): Promise<Album | null> {
        return this.albumsService.findById(id);
    }
    @Get('artista/:idArtista')
    async findAlbumbyArtista(@Param('idArtista') idArtista: number) {
        const albums= await this.albumsService.findAlbumbyArtista(idArtista);
        if (albums.length === 0) {
            throw new NotFoundException('No se encontraron artistas para este género');
        }
        return albums;
    }
    @Post()
    async create(@Body() albumDto: AlbumDto): Promise<Album> {
        return this.albumsService.createalbum(albumDto);
    }
    @Post(':id/foto')
    @UseInterceptors(
      FileInterceptor('fotoAlbum',  {
        dest: './public/artistas',
        fileFilter: (req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png)'), false);
          }
          cb(null, true);
        },
      }),
    )
    async uploadFoto(
      @Param('id') id: number,
      @UploadedFile() file: Express.Multer.File,
    ) {
        const album = await this.albumsService.getAlbumOr404(id);

        if (!album) {
          throw new NotFoundException(`Album con id ${id} no encontrado`);
        }
        const fileName = `${album.id}${extname(file.originalname)}`;

        const filePath = `public/albums/${fileName}`;
        try {
            await fsPromises.rename(file.path, filePath);
            console.log(filePath)
            return { message: 'Imagen cargada correctamente', filePath };
          } catch (error) {
            throw new Error('Error al mover el archivo: ' + error.message);
          }
    }


    @Put(":id")
    async update(@Param("id") id: number, @Body() album: AlbumDto): Promise<Album | null> {
        return this.albumsService.updateAlbum(id, album);
    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: number, @Body() album: Partial<AlbumDto>): Promise<Album | null> {
        return this.albumsService.updateAlbumPartial(id, album);
    }

    @Delete(":id")
    async delete(@Param("id") id: number): Promise<string> {
        await this.albumsService.deletealbum(id);
        return `Eliminado album con id ${id}`;
    }

}
