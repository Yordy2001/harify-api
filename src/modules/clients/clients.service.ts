import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }

  async create({ name, whatsapp }: CreateClientDto, tenantId: string | UUID) {

    const client = await this.clientRepository.findOneBy({ whatsapp })

    if (client) return new HttpException('Exite un cliente en este tenant con ese WhatsApp', HttpStatus.CONFLICT)

    const newclient = this.clientRepository.create({ name, whatsapp, tenant: { id: tenantId } })

    await this.clientRepository.save(newclient)

    return { name, whatsapp };
  }

  async findAll(tenantId: string | UUID) {

    const clientsByTenantId = await this.clientRepository.findBy({ tenant: { id: tenantId } })

    return clientsByTenantId;
  }

  async findOne(id: UUID, tenantId: any) {

    const clientByTenantId = await this.clientRepository.find({
      where: [
        {
          id,
          tenant: { id: tenantId }
        },
        {
          whatsapp: id.toString(),
          tenant: { id: tenantId }
        }
      ]
    })

    return clientByTenantId;

  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
