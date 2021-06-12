import { Rol } from "src/rol/entities";
import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert, ManyToMany, JoinTable } from "typeorm";

@Entity('usuarios_2021')
export class Usuario{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'rut', type: 'varchar', length: 20, default: '',unique: true})
    rut: string;

    @Column({ name: 'nombre', type: 'varchar', length: 200, default: ''})
    nombre: string;

    @Column({ name: 'apellido_paterno', type: 'varchar', length: 200, default: ''})
    apellido_paterno: string;

    @Column({ name: 'apellido_materno', type: 'varchar', length: 200, default: ''})
    apellido_materno: string;

    @Column({ name: 'activo', default: 1 })
    activo:boolean;

    @Column({ name: 'id_zoom', type: 'varchar', length: 200, default: ''})
    id_zoom: string;
    
    @Column({ name: 'imagen', type: 'varchar', length: 200, default: ''})
    imagen: string;

    @Column({ name: 'email', type: 'varchar', length: 200, default: '',unique: true})
    email: string;
    
    @Column({ name: 'password', type: 'varchar', length: 200, default: ''})
    password: string;

    @Column({ name: 'salt', type: 'varchar', length: 200, default: ''})
    salt: string;

    @Column({ name: 'anio_predeterminado', default: ''})
    anio_predeterminado: string;

    @Column({ name: 'entrar_como_id', default: ''})
    entrar_como_id: string;

    @Column({ name: 'colegio_predeterminado', default: ''})
    colegio_predeterminado: string;

    @Column({ name: 'rol_predeterminado', default: ''})
    rol_predeterminado: string;

    @Column({ name: 'scanner_predeterminado', default: ''})
    scanner_predeterminado: string;

    @Column({ name: 'template_predeterminado', default: ''})
    template_predeterminado: string;

    @Column({ name: 'edad', default: 0})
    edad: number;

    @Column({ name: 'sexo', type: 'varchar', default: ''})
    sexo: string;

    @Column({ name: 'telefono', type: 'varchar', default: ''})
    telefono: string;

    @Column({ name: 'creadoPor', type: 'varchar', default: ''})
    creadoPor: string;

    @Column({ name: 'modificadoPor', type: 'varchar', default: ''})
    modificadoPor: string;

    @ManyToMany(type => Rol, role => role.usuarios, { eager: true })
    @JoinTable({ name: 'user_roles' })
    roles: Rol[];

    @CreateDateColumn({ name: 'rolesdos'})
    rolesdos: Rol[];


    @CreateDateColumn({ name: 'createdAt'})
    createdPor: Date;

    @UpdateDateColumn({ name: 'updatedAt'})
    updatedPor: Date;

}
