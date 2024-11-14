import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Genero } from './genero/genero.model';
import { Artista } from './artista/artista.model';
import { Album} from './album/album.model';
import { Cancion } from './cancion/cancion.model';
import { ArtistaController } from './artista/artista.controller';
import { GeneroController } from './genero/genero.controller';
import { AlbumController } from './album/album.controller';
import { cancionController } from './cancion/cancion.controller';
import { GeneroService } from './genero/genero.service';
import { ArtistaService } from './artista/artista.service';
import { cancionService } from './cancion/cancion.service';
import { albumService } from './album/album.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "MilaLuksic59145",
      database: "practico4",
      entities: [Genero, Artista, Album, Cancion],
      synchronize: true, //solo mientras estén en desarrollo
  }),
  TypeOrmModule.forFeature([Genero, Artista, Album, Cancion]),

  ],
  controllers: [AppController,GeneroController,ArtistaController,AlbumController,cancionController],
  providers: [AppService,GeneroService,ArtistaService,albumService,cancionService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

//***HECHO ***/
//modelos
//relaciones
//controllers
//por postman
//frontend del crud
//cantantes por genero
//album por cantante
//canciones por album
//fotos  generos artistas y albums
//audios
//buscador
//vista arreglada


