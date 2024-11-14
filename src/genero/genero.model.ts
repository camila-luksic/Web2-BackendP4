import { Column, Entity, PrimaryGeneratedColumn,  OneToMany } from "typeorm";
import { Artista } from '../artista/artista.model';

@Entity()
export class Genero {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

  @OneToMany(() => Artista, (artista) => artista.genero)
  artistas?: Artista[];
}