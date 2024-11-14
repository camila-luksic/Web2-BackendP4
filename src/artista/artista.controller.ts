import { Body, Controller, Delete, Get, Param, Patch, Post, Put ,Query,NotFoundException,  UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { promises as fsPromises } from 'fs'; 
import { ArtistaService } from "./artista.service";
import { Artista } from "./artista.model";
import { ArtistaDto } from "./dto/artista.dto";
import { join } from 'path';

@Controller('artistas')
export class ArtistaController {
    constructor(
        private artistasService: ArtistaService
    ) {}
    @Get()
    list(): Promise<Artista[]> {
        return this.artistasService.findAll();
    }
    @Get(":id")
    get(@Param("id") id: number): Promise<Artista | null> {
        return this.artistasService.findById(id);
    }
    @Get('genero/:idGenero')
async findArtistasByGenero(@Param('idGenero') idGenero: number) {
    const artistas = await this.artistasService.findArtistasByGenero(idGenero);

    if (artistas.length === 0) {
        throw new NotFoundException('No se encontraron artistas para este género');
    }
    return artistas;
}

    @Post()
    async create(@Body() artistaDto: ArtistaDto): Promise<Artista> {
        return this.artistasService.createartista(artistaDto);
    }
    @Put(":id")
    async update(@Param("id") id: number, @Body() artista: ArtistaDto): Promise<Artista | null> {
        return this.artistasService.updateArtista(id, artista);
    }
    @Post(':id/foto')
    @UseInterceptors(
      FileInterceptor('fotoArtista',{
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
        const artista= await this.artistasService.getArtistaOr404(id);

        if (!artista) {
          throw new NotFoundException(`Artista con id ${id} no encontrado`);
        }
        const fileName = `${artista.id}${extname(file.originalname)}`;

        const filePath = `public/artistas/${fileName}`;
        try {
            await fsPromises.rename(file.path, filePath);
            console.log(filePath)
            return { message: 'Imagen cargada correctamente', filePath };
          } catch (error) {
            throw new Error('Error al mover el archivo: ' + error.message);
          }
    }


    @Patch(":id")
    async partialUpdate(@Param("id") id: number, @Body() artista: Partial<ArtistaDto>): Promise<Artista | null> {
        return this.artistasService.updateArtistaPartial(id, artista);
    }

    @Delete(":id")
    async delete(@Param("id") id: number): Promise<string> {
        await this.artistasService.deleteArtista(id);
        return `Eliminado artista con id ${id}`;
    }

}


