import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";

@Entity('rol')
export class RolPermisoDesarrollo{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name'})
    name: string;

    @Column({ name: 'type'})
    type: number;

    @Column({ name: 'description'})
    description: string;

}