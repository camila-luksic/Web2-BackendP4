import { Column, Entity, PrimaryGeneratedColumn , ManyToOne, JoinColumn} from "typeorm";
import { Album } from '../album/album.model';

@Entity()
export class Cancion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
    @ManyToOne(() => Album, (album) => album.canciones)
    @JoinColumn({ name: "idAlbum" }) 
    album: Album;
}