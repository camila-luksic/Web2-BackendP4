import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Artista } from '../artista/artista.model';
import { Cancion } from '../cancion/cancion.model';

@Entity()
export class Album {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;


    @ManyToOne(() => Artista, (artista) => artista.albumes)
    @JoinColumn({ name: "idArtista" })
    artista: Artista;

  @OneToMany(() => Cancion, (cancion) => cancion.album)
  canciones: Cancion[];
}