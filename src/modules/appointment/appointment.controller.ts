import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: AuthenticatedRequest) {

    const user = req.user;
    return this.appointmentService.create(createAppointmentDto, user.tenantId, user.id);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;
   
    
    return this.appointmentService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    return this.appointmentService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    return this.appointmentService.update(id, updateAppointmentDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {

    const tenantId = req.user.tenantId;

    return this.appointmentService.remove(id);
  }
}
