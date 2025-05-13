import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';

export class FilterInvoiceDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;
}
