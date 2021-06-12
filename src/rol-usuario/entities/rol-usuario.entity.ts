import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";

@Entity('rol_usuario_2021')
export class RolUsuario{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'usuario_id', type: 'varchar', default: ''})
    usuario_id: string;

    @Column({ name: 'rol_id', type: 'varchar', default: ''})
    rol_id: string;

    @Column({ name: 'tipo_id', type: 'varchar', default: ''})
    tipo_id: number;

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