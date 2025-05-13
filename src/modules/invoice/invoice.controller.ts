import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { AuthenticatedRequest } from 'src/shared/interfaces/autenticated-request.interface';
import { AuthGuard } from '@nestjs/passport';
import { UUID } from 'crypto';
import { ReportsService } from '../reports/reports.service';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';
import { InvoiceReportService } from './invoice-report.service';

interface FilterDto {
  from?: string;
  to?: string;
  employeeId?: string;
  serviceId?: string;
  clientId?: string;
}

@Controller('invoice')
@UseGuards(AuthGuard('jwt'))
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly reportsService: ReportsService,
    private readonly invoiceReportService: InvoiceReportService
  ) { }

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

  @Get('filtered')
  getFilteredInvoices(@Req() req,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('employeeId') employeeId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('clientId') clientId?: string,
  ) {
    const filters = {
      ...(from && { from }),
      ...(to && { to }),
      ...(employeeId && { employeeId }),
      ...(serviceId && { serviceId }),
      ...(clientId && { clientId })
    };
    console.log(from, to, employeeId, serviceId, clientId);
    
    const tenantId = req.user.tenantId;

    return this.invoiceService.getFilteredInvoices(filters, tenantId);
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

  @Get('reports/date-range')
  getByDateRange(
    @Query() dto: FilterInvoiceDto,
    @Req() req: any
  ) {
    return this.invoiceReportService.getByDateRange(dto, req.user.tenantId);
  }

  @Get('reports/employee/:id')
  getByEmployee(
    @Param('id') employeeId: string,
    @Req() req: any
  ) {
    return this.invoiceReportService.getByEmployee(employeeId, req.user.tenantId);
  }

  @Get('reports/service/:id')
  getByService(
    @Param('id') serviceId: string,
    @Req() req: any
  ) {
    return this.invoiceReportService.getByService(serviceId, req.user.tenantId);
  }

}
