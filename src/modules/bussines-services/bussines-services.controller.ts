import { UUID } from 'crypto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BussinesServices } from './bussines-services.service';
import { CreateBussinesServiceDto } from './dto/create-bussines-service.dto';
import { UpdateBussinesServiceDto } from './dto/update-bussines-service.dto';
import { AuthenticatedRequest } from 'src/shared/interfaces/autenticated-request.interface';

@Controller('bussines-services')
@UseGuards(AuthGuard('jwt'))
export class BussinesServicesController {
  constructor(private readonly bussinesServices: BussinesServices) { }

  @Post()
  create(@Body() createBussinesServiceDto: CreateBussinesServiceDto, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId

    return this.bussinesServices.create(createBussinesServiceDto, tenantId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const tenantId: UUID | string = req.user.tenantId

    return this.bussinesServices.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') term: UUID, @Req() req: AuthenticatedRequest) {
    const tenantId: UUID | string = req.user.tenantId

    return this.bussinesServices.findOne(term, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateBussinesServiceDto: UpdateBussinesServiceDto, @Req() req: AuthenticatedRequest) {
    const tenantId: UUID | string = req.user.tenantId

    return this.bussinesServices.update(id, updateBussinesServiceDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const tenantId: UUID | string = req.user.tenantId

    return this.bussinesServices.remove(+id);
  }
}
