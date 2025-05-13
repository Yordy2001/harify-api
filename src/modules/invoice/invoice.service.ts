import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { UUID } from 'crypto';
import { ClientsService } from '../clients/clients.service';
import { PrinterService } from 'src/shared/printer/printer.service';
import { invoiceReport } from '../reports/document/invoice.report';
import { User } from 'src/auth/entities/user.entity';
import { InvoiceStatusEnum } from './enums/invoice-status.enum';
import { PaymentMethodEnum } from './enums/payment-method.enum';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private _invoiceRepository: Repository<Invoice>,

    @InjectRepository(InvoiceItem)
    private _invoiceItemRepository: Repository<InvoiceItem>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private clientService: ClientsService,

    private readonly printerService: PrinterService,
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto, tenantId: string): Promise<PDFKit.PDFDocument> {

    const client = await this.clientService.findOne(createInvoiceDto.clientId, tenantId);

    const employee = await this.userRepository.findOne({
      where: { id: createInvoiceDto.employId },
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    const queryRunner = this._invoiceRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newInvoice = this._invoiceRepository.create({
        ...createInvoiceDto,
        client: { id: client?.id },
        employee: { id: employee.id }, // 👈 asignar empleado
        tenant: { id: tenantId },
        status: createInvoiceDto.status || 'pending',
      });

      const invoice = await queryRunner.manager.save(newInvoice);

      for (const item of createInvoiceDto.items) {
        const newInvoiceItem = this._invoiceItemRepository.create({
          quantity: item.quantity,
          unit_price: item.unitPrice,
          item_type: item.itemType,
          invoice: { id: invoice.id },
          total_price: item.unitPrice * item.quantity,
          item_id: item.itemId as `${string}-${string}-${string}-${string}-${string}`,
        });
        await queryRunner.manager.save(newInvoiceItem);
      }

      await queryRunner.commitTransaction();

      // Generar PDF
      const docDefinition = invoiceReport(client, employee, invoice, createInvoiceDto);
      return this.printerService.createPdf(docDefinition);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create invoice', error);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(tenantId: string) {
    return await this._invoiceItemRepository.find()
  }

  findOne(id: UUID, tenantId: string) {
    return this._invoiceRepository.findOne({ where: { id } });
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }

  async getFilteredInvoices(filters: {
    from?: string;
    to?: string;
    employeeId?: string;
    serviceId?: string;
    clientId?: string;
  }, tenantId: string) {
      console.log(filters);
  
      const query = this._invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.employee', 'employee')
      .leftJoinAndSelect('invoice.client', 'client')
      .leftJoinAndSelect('invoice.invoiceItems', 'items')
      .where('invoice.tenant.id = :tenantId', { tenantId });
  
    // Filtro por fechas
    if (filters.from) query.andWhere('invoice.created_at >= :from', { from: filters.from });
    if (filters.to) query.andWhere('invoice.created_at <= :to', { to: filters.to });
  
    // Filtro por empleado
    if (filters.employeeId) query.andWhere('employee.id = :employeeId', { employeeId: filters.employeeId });
  
    // Filtro por cliente
    if (filters.clientId) query.andWhere('client.id = :clientId', { clientId: filters.clientId });
  
    // Filtro por servicio
    if (filters.serviceId) query.andWhere('items.item_id = :serviceId', { serviceId: filters.serviceId });
  
    return query.getMany();
  }

}
