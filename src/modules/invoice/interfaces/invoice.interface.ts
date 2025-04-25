import { UUID } from "crypto";
import { Timestamp } from "typeorm";
import { InvoiceStatusEnum } from "../enums/invoice-status.enum";
import { PaymentMethodEnum } from "../enums/payment-method.enum";

export interface IIvoice {
    id: UUID;
    // tenant_id: UUID;
    // client_id: UUID;
    total_amount: number;
    payment_method: PaymentMethodEnum;
    status: InvoiceStatusEnum;
    created_at: Timestamp;
    updated_at: Timestamp;
}
