import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { AuthenticatedRequest } from 'src/shared/interfaces/autenticated-request.interface';
import { AuthGuard } from '@nestjs/passport';
import { UUID } from 'crypto';
import { ReportsService } from '../reports/reports.service';

@Controller('invoice')
@UseGuards(AuthGuard('jwt'))
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly reportsService: ReportsService) { }

  @Post()
  async create(@Res() res: Response, @Body() createInvoiceDto: CreateInvoiceDto, @Req() req: AuthenticatedRequest) {
    const tenantId = req.user.tenantId;

    const pdfDoc = await this.invoiceService.create(createInvoiceDto, tenantId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
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
