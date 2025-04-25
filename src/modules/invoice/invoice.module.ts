import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Invoice } from './entities/invoice.entity';
// import { Client } from '../clients/entities/client.entity';
import { ClientsService } from '../clients/clients.service';
import { ClientsModule } from '../clients/clients.module';
import { PrinterModule } from 'src/shared/printer/printer.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceItem, Invoice]),
    ClientsModule,
    PrinterModule,
    ReportsModule
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
