import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";

@Entity('rol_hijo')
export class RolHijoDesarrollo{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'parent', type: 'varchar', default: ''})
    parent: string;

    @Column({ name: 'child', type: 'varchar', default: ''})
    child: string;


}