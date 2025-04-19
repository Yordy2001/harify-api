import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { APPOITMENT_STATUS } from '../enums/appoitment-status.enum';

export class UpdateAppointmentDto {

    @IsOptional()
    @IsOptional()
    @IsEnum(APPOITMENT_STATUS)
    status: APPOITMENT_STATUS;

    @IsOptional()
    @IsOptional()
    @IsDateString()
    date: string;

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    clientId: string[];

    @IsOptional()
    @IsUUID()
    @IsNotEmpty()
    serviceId: string[];
}
