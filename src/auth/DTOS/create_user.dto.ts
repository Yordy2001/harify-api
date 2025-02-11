import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {

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
  @IsString()
  @IsNotEmpty()
  tenant_id: string;
}
