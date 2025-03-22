import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AuthenticatedRequest } from 'src/shared/interfaces/autenticated-request.interface';
import { UUID } from 'crypto';
import { AuthGuard } from '@nestjs/passport';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto,  @Req() req: AuthenticatedRequest) {

    const tenantId = req.user.tenantId;

    return this.inventoryService.create(createInventoryDto, tenantId);
  }

  @Get()
  findAll( @Req() req: AuthenticatedRequest) {
    const tenantId = req.user?.tenantId;
  
    return this.inventoryService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;
    
    return this.inventoryService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateInventoryDto: UpdateInventoryDto, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    return this.inventoryService.update(id, tenantId, updateInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;
    return this.inventoryService.remove(id, tenantId);
  }
}
