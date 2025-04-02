import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UUID } from 'crypto';

import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthenticatedRequest } from 'src/shared/interfaces/autenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt-auth.guard';

@Controller('appointment')
@UseGuards(AuthGuard('jwt'))
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: AuthenticatedRequest) {

    const user = req.user;
    return await this.appointmentService.create(createAppointmentDto, user.tenantId, user.id);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;
   
    return await this.appointmentService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: UUID, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    return await this.appointmentService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(@Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    return await this.appointmentService.update(id, updateAppointmentDto, tenantId);
  }

  @Delete(':id')
 async remove(@Param('id') id: UUID, @Req() req: AuthenticatedRequest) {
    return await this.appointmentService.remove(id);
  }
}
