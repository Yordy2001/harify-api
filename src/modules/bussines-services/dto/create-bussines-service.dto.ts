import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBussinesServiceDto {
    
    @IsString()
    name: string;

    @IsNotEmpty()
    duration: string;

    @IsNotEmpty()
    @IsNumber()
    price: number
}
