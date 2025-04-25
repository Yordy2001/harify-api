import { UUID } from "crypto";
import { Tenant } from "src/tenant/entities/tenant.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Gender } from "../enums/gender.enum";

@Entity()
export class Client {

    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    last_name: string;

    @Column({ nullable: false, unique: true })
    whatsapp: string;

    @Column({ nullable: true, enum: Gender })
    gender: string;

    @Column({ nullable: false })
    age: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Tenant, { nullable: false })
    tenant: Tenant
}
