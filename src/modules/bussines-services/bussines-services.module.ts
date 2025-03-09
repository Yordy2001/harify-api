import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BussinesServices } from './bussines-services.service';
import { BussinesServicesController } from './bussines-services.controller';
import { BussinesService } from './entities/bussines-service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BussinesService]),
  ],
  controllers: [BussinesServicesController],
  providers: [BussinesServices],
  exports: [BussinesServices]
})
export class BussinesServicesModule { }
