import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from 'src/shared/printer/printer.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [PrinterModule],
  exports: [ReportsService],
})
export class ReportsModule {}
