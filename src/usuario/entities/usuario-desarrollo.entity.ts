import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert, ManyToMany } from "typeorm";

@Entity('usuario')
export class UsuarioDesarrollo{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'rut', type: 'varchar', length: 20, default: '',unique: true})
    rut: string;

    @Column({ name: 'nombre', type: 'varchar', length: 200, default: ''})
    nombre: string;

    @Column({ name: 'apellido_paterno', type: 'varchar', length: 200, default: ''})
    apellido_paterno: string;

    @Column({ name: 'apellido_materno', type: 'varchar', length: 200, default: ''})
    apellido_materno: string;

    @Column({ name: 'id_zoom', type: 'varchar', length: 200, default: ''})
    id_zoom: string;

    @Column({ name: 'email', type: 'varchar', length: 200, default: '',unique: true})
    email: string;

    @Column({ name: 'anio_predeterminado'})
    anio_predeterminado: string;



}