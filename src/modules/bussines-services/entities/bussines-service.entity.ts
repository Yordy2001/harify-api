import { UUID } from "crypto";
import { Tenant } from "src/tenant/entities/tenant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('services')
export class BussinesService {

    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column()
    name: string;

    @Column()
    duration: string;

    @Column()
    price: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


    @ManyToOne(() => Tenant, { nullable: false })
    tenant: Tenant
}
