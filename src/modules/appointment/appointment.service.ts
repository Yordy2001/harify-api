import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { AppoitmenService } from './entities/appoitmentService.entity';
import { AppointmentClient } from './entities/appointment-client.entity';

@Injectable()
export class AppointmentService {

  constructor(
    @InjectRepository(Appointment)
    private _appointmentRepository: Repository<Appointment>,
    @InjectRepository(AppoitmenService)
    private _appointmentServiceRepository: Repository<AppoitmenService>,
    @InjectRepository(AppointmentClient)
    private _appointmentClientRepository: Repository<AppointmentClient>
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto, tenantId: string, userId: string) {

    try {
      const newAppointment = this._appointmentRepository.create({
        ...createAppointmentDto,
        user_id: { id: userId },
        tenant_id: { id: tenantId }
      })

      const { id } = await this._appointmentRepository.save(newAppointment);

      await this._createAppointmentService(createAppointmentDto.serviceId, id);

      await this._createAppointmentClient(createAppointmentDto.clientId, id);

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
      const appointment = await this._appointmentRepository.find({
        where: {
          tenant_id: { id: tenantId }
        },
        select: {
          id: true,
          status: true,
          date: true as any,
        },
        relations: [
          // 'user_id',
          // 'tenant_id',
          'appointmentClients', // Relación con AppointmentClient
          'appointmentClients.client_id', // Cliente dentro de AppointmentClient
          // 'appointmentServices', // Relación con AppoitmenService
          'appointmentServices.service', // Servicio dentro de AppoitmenService
        ],
      })
      return {
        msg: 'All appoitments',
        data: appointment
      }
    } catch (error) {
      console.log("FindAll Appointment", error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: UUID, tenantId: string) {
    let appointment: Appointment | null = null;

    try {
      appointment = await this._appointmentRepository.findOne({
        where: {
          id,
          tenant_id: { id: tenantId },
        },
        select: {
          id: true,
          status: true,
          date: true as any,
        },
        relations: [
          // 'user_id',
          // 'tenant_id',
          'appointmentClients', // Relación con AppointmentClient
          'appointmentClients.client_id', // Cliente dentro de AppointmentClient
          // 'appointmentServices', // Relación con AppoitmenService
          'appointmentServices.service', // Servicio dentro de AppoitmenService
        ],
      })

      if (!appointment) throw new NotFoundException(`There is no appointment with id: ${id}`);

    } catch (error) {
      console.log("Find One Appointment", error);
      throw new HttpException('Internar server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return {
      msg: 'appointment',
      data: appointment
    }
  }

  async update(id: UUID, updateAppointmentDto: UpdateAppointmentDto, tenantId: string) {

    const isAppointment = await this._appointmentRepository.findOne({ where: { id, tenant_id: { id: tenantId } } });

    if (!isAppointment) throw new NotFoundException(`Appointment with id: ${id} not found`)

    console.log(updateAppointmentDto);

    try {
      const updatedAppointment = await this._appointmentRepository.update(isAppointment.id, updateAppointmentDto);
      return {
        msg: `Appointment updated`,
        data: updatedAppointment
      }
    } catch (error) {
      console.log('Update Appointment: ', error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: UUID, tenantId: string) {

    const isAppointment = await this._appointmentRepository.findOne({ where: { id, tenant_id: { id: tenantId } } });

    if (!isAppointment) throw new NotFoundException(`Appointment with id: ${id} not found`)

    try {

      await this._appointmentRepository.delete(isAppointment.id);
      return {
        msg: ``,
        status: HttpStatus.NO_CONTENT
      }

    } catch (error: any) {

      console.log('Delete Appointment: ', error);
      throw new InternalServerErrorException()
    }

  }

  private async _createAppointmentService(services: string[], appointment: UUID) {
    try {
      const appointmentServices = services.map((service: any) => {
        return this._appointmentServiceRepository.create({
          service,
          appointment: { id: appointment },
        });
      });

      const appointment_service = await this._appointmentServiceRepository.save(appointmentServices)
      return appointment_service
    } catch (error) {
      console.log("_createAppointmentService", error);
      throw new InternalServerErrorException()
    }
  }

  private async _createAppointmentClient(clientsId: string[], appointment: UUID) {
    try {
      const appointmentClients = clientsId.map((clientId: UUID) => {
        return this._appointmentClientRepository.create({
          client_id: { id: clientId },
          appoitment_id: { id: appointment }
        })
      })

      await this._appointmentClientRepository.save(appointmentClients);
      return
    } catch (error) {
      console.log("_createAppointmentClient", error);
      throw new InternalServerErrorException()
    }
  }
}
