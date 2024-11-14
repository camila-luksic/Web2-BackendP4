import { Body, Controller, Delete, Get, Param, Patch, Post, Put,  UseInterceptors, UploadedFile,NotFoundException  } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { promises as fsPromises } from 'fs'; 
import { GeneroService } from "./genero.service";
import { Genero } from "./genero.model";
import { GeneroDto } from "./dto/genero.dto";


@Controller('generos')
export class GeneroController {
    constructor(private generosService: GeneroService) {}
    @Get()
    list(): Promise<Genero[]> {
        return this.generosService.findAll();
    }
    @Get(":id")
    get(@Param("id") id: number): Promise<Genero | null> {
        return this.generosService.findById(id);
    }
    @Post()
    create(@Body() genero: GeneroDto): Promise<Genero> {
        return this.generosService.creategenero({
            id: 0,
            nombre: genero.nombre
        });
    }

    @Post(':id/foto')
    @UseInterceptors(
      FileInterceptor('fotoPerfil', {
        dest: './public/generos',  
  
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
        const genero = await this.generosService.getGeneroOr404(id);

        if (!genero) {
          throw new NotFoundException(`Género con id ${id} no encontrado`);
        }
    
        const fileName = `${genero.id}${extname(file.originalname)}`;
        const filePath = `public/generos/${fileName}`;
    
      
        try {
            await fsPromises.rename(file.path, filePath);  
            console.log(filePath)
      
            return { message: 'Imagen cargada correctamente', filePath };
          } catch (error) {
            throw new Error('Error al mover el archivo: ' + error.message);
          }
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() genero: GeneroDto): Promise<Genero | null> {

        return this.generosService.updateGenero(id, genero);
    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: number, @Body() genero: Partial<GeneroDto>): Promise<Genero | null> {

        return this.generosService.updateGeneroPartial(id, genero);
    }
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<string> {
        await this.generosService.deleteGenero(id);
        return `Eliminado género con id ${id}`;
    }
    

}
