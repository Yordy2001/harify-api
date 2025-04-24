import { UUID } from 'crypto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthenticatedRequest } from 'src/shared/interfaces/autenticated-request.interface';

@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @Post()
  create(@Body() createClientDto: CreateClientDto, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId
    return this.clientsService.create(createClientDto, tenantId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {

    const tenantId = req.user.tenantId

    return this.clientsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID, @Req() req: AuthenticatedRequest) {

    const tenantId = req.user.tenantId

    return this.clientsService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateClientDto: UpdateClientDto, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId

    return this.clientsService.update(id, tenantId, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    return this.clientsService.remove(id, tenantId);
  }

  @Get('verify/:tel')
  verifyByTel(@Param('tel') tel: UUID, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;
    return this.clientsService.verifyByTell(tel, tenantId);
  }
}
