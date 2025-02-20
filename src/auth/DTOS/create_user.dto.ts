import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import { ITenant } from "src/tenant/interfaces/tenant.interface";

export class CreateUserDto {
  
  @ApiProperty()
  @IsString()
  name: string
  
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
