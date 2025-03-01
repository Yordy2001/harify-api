import { IsString } from "class-validator";

export class CreateClientDto {

    @IsString()
    name: string;

    @IsString()
    whatsapp: string;
}
