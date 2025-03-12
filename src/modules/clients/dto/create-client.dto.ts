import { IsNumber, IsString } from "class-validator";

export class CreateClientDto {

    @IsString()
    name: string;

    @IsString()
    last_name:string;
    
    @IsString()
    whatsapp: string;

    @IsString()
    gender: string;

    @IsNumber()
    age: number;
}
