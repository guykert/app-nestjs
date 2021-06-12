import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";

@Entity('configuracion_2021')
export class Configuracion{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'anio_academico', type: 'varchar', length: 200, default: '',unique: true})
    anio_academico: string;

    @Column({ name: 'anio_forzado'})
    anio_forzado: number;

    @Column({ name: 'activo', default: 1 })
    activo:boolean;

    @Column({ name: 'creadoPor', type: 'varchar', default: ''})
    creadoPor: string;

    @Column({ name: 'modificadoPor', type: 'varchar', default: ''})
    modificadoPor: string;
    
    @CreateDateColumn({ name: 'createdAt'})
    createdPor: Date;

    @UpdateDateColumn({ name: 'updatedAt'})
    updatedPor: Date;

}
