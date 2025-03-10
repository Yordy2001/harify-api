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

  async create(createClientDto: CreateClientDto, tenantId: string | UUID) {

    const client = await this.clientRepository.findOne({
      where: {
        whatsapp: createClientDto.whatsapp,
        tenant: { id: tenantId },
      },
      withDeleted: false
    })

    if (client) return new HttpException('Exite un cliente en este tenant con ese WhatsApp', HttpStatus.CONFLICT)

    const newclient = this.clientRepository.create({
      name: createClientDto.name,
      last_name: createClientDto.lastName,
      whatsapp: createClientDto.whatsapp,
      gender: createClientDto.gender,
      age: createClientDto.age,
      tenant: { id: tenantId }
    })

    try {
      await this.clientRepository.save(newclient)

    } catch (error) {
      console.log('', error);
      return new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return {
      newclient,
      status: HttpStatus.OK,
    };
  }

  async findAll(tenantId: string | UUID) {

    try {

      const clientsByTenantId = await this.clientRepository.find({
        select: {
          id: true,
          name: true,
          last_name: true,
          whatsapp: true,
          gender: true,
          age: true
        },
        where: { tenant: { id: tenantId } },
        withDeleted: false // Skip clients with deletet column true
      })

      return clientsByTenantId;
    } catch (error) {
      console.log('FindAll clients', error);
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: UUID, tenantId: any): Promise<Partial<Client> | null> {
    let clientByTenantId: Partial<Client> | null = null;

    try {
      clientByTenantId = await this.clientRepository.findOne({
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

      if (!clientByTenantId) return new HttpException(`Client with ${id} not found`, HttpStatus.NOT_FOUND)

      return clientByTenantId;
    } catch (error) {

      console.log('finOne client', error);
      new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return clientByTenantId;
  }

  async update(id: UUID, tenantId: any, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id, tenantId)

    try {
      await this.clientRepository.update({ id: client?.id }, updateClientDto)
      return { msg: `client with name ${client?.name} updated`, status: HttpStatus.ACCEPTED };

    } catch (error) {
      console.log(error);
      return new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async remove(term: UUID, tenantId: any) {
    const client = await this.findOne(term, tenantId);
    if (client) {
      try {
        await this.clientRepository.softRemove(client);
        return HttpStatus.NO_CONTENT
      } catch (error) {
        console.log(error);
        return new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
