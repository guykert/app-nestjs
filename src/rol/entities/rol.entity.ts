import { Usuario } from "src/usuario/entities";
import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert, ManyToMany } from "typeorm";

@Entity('rol_2021')
export class Rol{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'nombre', type: 'varchar', default: '',unique: true})
    nombre: string;

    @Column({ name: 'descripcion', type: 'varchar', default: ''})
    descripcion: string;

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

    @ManyToMany(type => Usuario, usuario => usuario.roles)
    @JoinColumn()
    usuarios: Usuario[];


}