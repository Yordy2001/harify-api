import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/shared/interfaces/autenticated-request.interface';

@Controller('employees')
@UseGuards(AuthGuard('jwt'))
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId
    return this.employeesService.create(createEmployeeDto, tenantId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId
    return this.employeesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId
    return this.employeesService.findOne(tenantId, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId
    return this.employeesService.update(tenantId, id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId
    return this.employeesService.remove(tenantId, id);
  }
}
