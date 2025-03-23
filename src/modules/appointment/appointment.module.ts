import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentClient } from './entities/appointment-client.entity';
import { AppoitmenService } from './entities/appoitmentService.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, AppointmentClient, AppoitmenService])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
