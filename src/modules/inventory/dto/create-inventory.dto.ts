import { IsDecimal, IsNumber, IsString } from "class-validator";
import { Decimal128 } from "typeorm";

export class CreateInventoryDto {

    @IsString()
    name: string

    @IsNumber()
    quantity: number;

    @IsDecimal()
    price: string;

    @IsNumber()
    min_stock: number;

}

    