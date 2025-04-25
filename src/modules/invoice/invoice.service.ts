import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
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

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private _invoiceRepository: Repository<Invoice>,

    @InjectRepository(InvoiceItem)
    private _invoiceItemRepository: Repository<InvoiceItem>,

    private clientService: ClientsService,

    private readonly printerService: PrinterService,
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto, tenantId: string): Promise<PDFKit.PDFDocument> {

    const client = await this.clientService.findOne(createInvoiceDto.clientId, tenantId);

    const queryRunner = this._invoiceRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newInvoice = this._invoiceRepository.create({
        ...createInvoiceDto,
        client: { id: client?.id },
        tenant: { id: tenantId },
        status: createInvoiceDto.status || 'pending',
      });

      const invoice = await queryRunner.manager.save(newInvoice);

      // Create invoice items
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

      // Generate PDF
      const docDefinition = invoiceReport(client, invoice, createInvoiceDto);
      return this.printerService.createPdf(docDefinition);
    }
    catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create invoice', error);
    }
    finally {
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

}
