import { Body, Controller, Delete, Get, Param, Patch, Post, Put ,NotFoundException,UseInterceptors, UploadedFile,Query} from "@nestjs/common";
import { cancionService } from "./cancion.service";
import { Cancion } from "./cancion.model";
import { CancionDto } from "./dto/cancion.dto";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('cancion')
export class cancionController {
    constructor(
        private cancionsService: cancionService
    ) {}
    @Get()
    list(): Promise<Cancion[]> {
        console.log("llama")
        return this.cancionsService.findAll();
    }
    @Get("buscar")
    async search(@Query("q") query: string) {
        console.log("*******************************************");
        console.log("Recibido el query:", query); 
        if (!query || query.trim() === "") {
            console.log("No se proporcionó término de búsqueda.");
            throw new NotFoundException("Debe proporcionar un término de búsqueda.");
        }
        const resultados = await this.cancionsService.search(query);
        if (!resultados.artistas.length && !resultados.albums.length && !resultados.canciones.length) {
            console.log("No se encontraron resultados.");
            throw new NotFoundException("No se encontraron resultados.");
        }
        return resultados;
    }

    @Get(":id")
    get(@Param("id") id: number): Promise<Cancion | null> {
        return this.cancionsService.findById(id);
    }
    @Get('album/:idAlbum')
    async findAlbumbyArtista(@Param('idAlbum') idAlbum: number) {
        const canciones= await this.cancionsService.findCancionbyAlbum(idAlbum);
        if (canciones.length === 0) {
            throw new NotFoundException('No se encontraron artistas para este género');
        }
        return canciones;
    }

    @Post()
    async create(@Body() cancionDto: CancionDto): Promise<Cancion> {
        return this.cancionsService.createcancion(cancionDto);
    }
    @Post('mp3/:id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './public/canciones',
            filename: (req, file, callback) => {
                const id = req.params.id;
                const filename = `${id}.mp3`;
                callback(null, filename);
            }
        })
    }))
    async uploadFile(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new NotFoundException('No se ha proporcionado un archivo');
        }

        return { message: 'Archivo guardado correctamente' };
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() cancion: CancionDto): Promise<Cancion | null> {
        return this.cancionsService.updatecancion(id, cancion);
    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: number, @Body() cancion: Partial<CancionDto>): Promise<Cancion | null> {
        return this.cancionsService.updatecancionPartial(id, cancion);
    }

    @Delete(":id")
    async delete(@Param("id") id: number): Promise<string> {
        await this.cancionsService.deletecancion(id);
        return `Eliminado cancion con id ${id}`;
    }

}
