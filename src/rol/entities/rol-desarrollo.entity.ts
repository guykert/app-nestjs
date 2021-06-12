import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert, ManyToMany } from "typeorm";

@Entity('rol')
export class RolDesarrollo{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name'})
    name: string;

    @Column({ name: 'type'})
    type: number;

    @Column({ name: 'description'})
    description: string;

    // @ManyToMany(type => Usuario, usuario => usuario.roles)
    // @JoinColumn()
    // usuarios: Usuario[];


}