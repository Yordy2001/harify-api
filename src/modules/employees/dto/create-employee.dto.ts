import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { ITenant } from "src/tenant/interfaces/tenant.interface";

export class CreateEmployeeDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsEmail()
    @IsString()
    email: string;

    @IsStrongPassword()
    @ApiProperty()
    password: string;

    @ApiProperty()
    role: string[];

    @ApiProperty()
    tenant: ITenant;

}
