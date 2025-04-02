import { IsDateString, IsEnum, IsOptional } from 'class-validator';
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
}
