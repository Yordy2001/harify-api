import { PartialType } from '@nestjs/swagger';
import { CreateBussinesServiceDto } from './create-bussines-service.dto';

export class UpdateBussinesServiceDto extends PartialType(CreateBussinesServiceDto) {}
