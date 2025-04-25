import { UUID } from "crypto";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./invoice.entity";

@Entity('invoice_item')
export class InvoiceItem {

    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({nullable: true})
    description?: string

    @Column({ type: 'int' })
    quantity: number;

    @Column('decimal')
    unit_price: number;

    @Column('decimal')
    total_price: number;

    @Column({ default: 'SERVICE' })
    item_type: string;

    @ManyToOne(() => Invoice, { nullable: false })
    invoice: Invoice;

    // ref to productId or serviceId
    @Column()
    item_id:UUID;
}
