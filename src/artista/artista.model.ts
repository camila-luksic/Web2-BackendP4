import { Column, Entity, PrimaryGeneratedColumn , ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { Genero } from '../genero/genero.model';
import { Album } from '../album/album.model';

@Entity()
export class Artista {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;


    @ManyToOne(() => Genero, (genero) => genero.artistas)
    @JoinColumn({ name: "idGenero" })
    genero: Genero;

    @OneToMany(() => Album, (album) => album.artista)
    albumes: Album[];
}