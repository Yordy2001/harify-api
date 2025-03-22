import { UUID } from "crypto";
import { Tenant } from "src/tenant/entities/tenant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn,
         Timestamp, UpdateDateColumn } from "typeorm";


@Entity()
export class Suppliers {

    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column('varchar')
    name: string;

    @Column('varchar')
    contact: string;

    @Column('text')
    address: string;

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;

    @ManyToOne(()=> Tenant, {nullable: false})
    tenant: Tenant
}
