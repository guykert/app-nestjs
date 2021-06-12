import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";

@Entity('rol_hijo_2021')
export class RolHijo{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'padre_id', type: 'varchar', default: ''})
    padre_id: string;

    @Column({ name: 'hijo_id', type: 'varchar', default: ''})
    hijo_id: string;

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