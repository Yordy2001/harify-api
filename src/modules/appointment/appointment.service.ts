import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentService {

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>) { }

  async create(createAppointmentDto: CreateAppointmentDto, tenantId: string, userId: string) {

    try {
      const newAppointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        user_id: { id: userId },
        tenant_id: { id: tenantId }
      })

      await this.appointmentRepository.save(newAppointment);
      return {
        msg: 'Appointment created sussces',
        data: newAppointment
      }
    } catch (error) {
      console.log('create appointment', error);
      throw new HttpException('internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(tenantId: string) {
    try {
      const appointment = await this.appointmentRepository.find({
        where: {
          tenant_id: { id: tenantId }
        },
        relations: []
      })
      return {
        msg: 'All appoitment',
        data: appointment
      }
    } catch (error) {
      console.log("FindAll Appointment", error);
      throw new InternalServerErrorException();
    }
  }

  findOne(id: UUID, tenantId: string) {
    return `This action returns a #${id} appointment`;
  }

  update(id: string, updateAppointmentDto: UpdateAppointmentDto, tenantId: string) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: string) {
    return `This action removes a #${id} appointment`;
  }
}
