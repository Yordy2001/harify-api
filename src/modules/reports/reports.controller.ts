import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('')
  async getInvoiceReport(@Res() res: Response) {
    const pdfDoc = await this.reportsService.getInvoiceReport();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    // pdfDoc.pipe(res);
    // pdfDoc.end();
  }
  
  @Get('invoice/summary')
  async getInvoiceSummaryReport() {
    const pdfDoc = await this.reportsService.getInvoiceSummaryReport();
  }
}
