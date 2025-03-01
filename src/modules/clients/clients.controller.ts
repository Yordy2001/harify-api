import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/shared/interfaces/autenticated-request.interface';
import { UUID } from 'crypto';

@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

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
  findOne(@Param('id') id: UUID) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
