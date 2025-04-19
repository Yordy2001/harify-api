import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { InvoiceStatusEnum } from "../enums/invoice-status.enum";

class InvoiceItemDto {
    @IsUUID()
    itemId: string;
  
    @IsNotEmpty()
    itemType: 'service' | 'product';
  
    @IsNotEmpty()
    quantity: number;
  
    @IsNotEmpty()
    unitPrice: number;
}

export class CreateInvoiceDto {

    @IsString()
    clientId: UUID;

    @IsOptional()
    @IsString()
    appointment_id?: string;

    @IsArray()
    @ValidateNested({ each: true })
    // @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[];

    @IsOptional()
    @IsEnum(InvoiceStatusEnum)
    status?: string;

    @IsNumber()
    totalAmount: number;

    @IsString()
    paymentMethod: string;
  
    @IsOptional()
    @IsString()
    notes?: string;
}
 