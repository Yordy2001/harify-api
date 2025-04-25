import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAppointmentDto {
  
  @IsUUID()
  @IsNotEmpty()
  clientId: string[];

  @IsUUID()
  @IsNotEmpty()
  serviceId: string[];

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  status?: string;
}
