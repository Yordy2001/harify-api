import { UUID } from "crypto";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { PaymentMethodEnum } from "../enums/payment-method.enum";
import { Tenant } from "src/tenant/entities/tenant.entity";
import { Client } from "src/modules/clients/entities/client.entity";
import { InvoiceStatusEnum } from "../enums/invoice-status.enum";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({ type: 'decimal' })
    total_amount: number;

    @Column({ enum: PaymentMethodEnum })
    payment_method: string;

    @Column({enum: InvoiceStatusEnum, default: InvoiceStatusEnum.PENDING})
    status: string;

    @UpdateDateColumn()
    updated_at: Timestamp;

    @CreateDateColumn()
    created_at: Timestamp;

    @ManyToOne(() => Tenant, { nullable: false })
    tenant: Tenant

    @ManyToOne(() => Client, { nullable: false })
    client: Client
}
