import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';

@Injectable()
export class InvoiceReportService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>
  ) {}

  async getByDateRange(dto: FilterInvoiceDto, tenantId: string) {

    return this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.client', 'client')
      .leftJoinAndSelect('invoice.employee', 'employee')
      .leftJoinAndSelect('invoice.invoiceItems', 'invoiceItems')
      .where('invoice.tenantId = :tenantId', { tenantId })
      .andWhere(dto.startDate ? 'invoice.created_at >= :startDate' : '1=1', { startDate: dto.startDate })
      .andWhere(dto.endDate ? 'invoice.created_at <= :endDate' : '1=1', { endDate: dto.endDate })
      .getMany();
  }

  async getByEmployee(employeeId: string, tenantId: string) {
    return this.invoiceRepository.find({
      where: {
        tenant: { id: tenantId },
        employee: { id: employeeId }
      },
      relations: ['client', 'employee', 'invoiceItems'],
    });
  }

  async getByService(serviceId: string, tenantId: string) {
    return this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.invoiceItems', 'item')
      .leftJoinAndSelect('invoice.client', 'client')
      .leftJoinAndSelect('invoice.employee', 'employee')
      .where('invoice.tenantId = :tenantId', { tenantId })
      .andWhere('item.item_id = :serviceId', { serviceId })
      .getMany();
  }
}
