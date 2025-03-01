import { UUID } from "crypto";
import { Tenant } from "src/tenant/entities/tenant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Client {

    @PrimaryGeneratedColumn('uuid')
    id: UUID

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, unique: true })
    whatsapp: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Tenant, { nullable: false })
    tenant: Tenant
}
