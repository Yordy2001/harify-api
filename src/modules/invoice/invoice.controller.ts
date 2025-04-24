import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { AuthenticatedRequest } from 'src/shared/interfaces/autenticated-request.interface';
import { AuthGuard } from '@nestjs/passport';
import { UUID } from 'crypto';

@Controller('invoice')
@UseGuards(AuthGuard('jwt'))
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    return this.invoiceService.create(createInvoiceDto, tenantId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    return this.invoiceService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    return this.invoiceService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(+id);
  }
}
