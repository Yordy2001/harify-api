import { UUID } from "crypto";
import {
    BeforeInsert,
    BeforeUpdate,
    Column, CreateDateColumn, Entity, ManyToOne,
    PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
} from "typeorm";

import { Tenant } from "src/tenant/entities/tenant.entity";
import { Suppliers } from "./suppliers.entity";

@Entity('inventory')
export class Inventory {

    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({ nullable: false })
    name: string;

    @Column('int', { nullable: false })
    quantity: number;

    @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
    price: string;

    @Column('int', { default: 1 })
    min_stock: number;

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;

    @ManyToOne(() => Tenant, { nullable: false })
    tenant: Tenant;

    @ManyToOne(() => Suppliers, { nullable: true })
    supplier: Suppliers

    @BeforeInsert()
    @BeforeUpdate()
    formatName() {
        this.name = this.name.toLowerCase().replace(/\s+/g, '_'); // Convierte a minúsculas y reemplaza espacios por _
    }
}
