import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";

@Entity('configuracion')
export class ConfiguracionDesarrollo{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'anio_academico'})
    anio_academico: string;

    @Column({ name: 'anio_forzado'})
    anio_forzado: number;


}