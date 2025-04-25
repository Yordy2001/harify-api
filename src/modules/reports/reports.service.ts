import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/shared/printer/printer.service';
import { invoiceReport } from './document/invoice.report';

@Injectable()
export class ReportsService {

    constructor(
        private readonly printerService: PrinterService,
    ) { }

    async getInvoiceReport() {
        // Logic to generate invoice report
        // const docDefinition = invoiceReport();
            
        return 'this.printerService.createPdf(docDefinition)';
    }

    async getInvoiceSummaryReport() {
        // Logic to generate invoice summary report
        return { message: 'Invoice summary report generated' };
    }
}
