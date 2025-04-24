import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

// ! Todo! Return good status code
// ! Todo! return json {msg: message, status: Status code}
// ! Todo! Validate tenantId

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }

  async create(createClientDto: CreateClientDto, tenantId: string | UUID) {

    // ! Todo! Add validation "if exits a client with same whatspp" before create client
    const client = await this.clientRepository.findOne({
      where: {
        whatsapp: createClientDto.whatsapp,
        tenant: { id: tenantId },
      },
      withDeleted: false
    })

    if (client) {
      throw new HttpException('Exite un cliente en este tenant con ese WhatsApp', HttpStatus.CONFLICT)
    }

    const newclient = this.clientRepository.create({
      name: createClientDto.name,
      last_name: createClientDto.last_name,
      whatsapp: createClientDto.whatsapp,
      gender: createClientDto.gender,
      age: createClientDto.age,
      tenant: { id: tenantId }
    })

    try {
      await this.clientRepository.save(newclient)
      return {
        newclient,
        status: HttpStatus.OK,
      };

    } catch (error) {
      console.log('', error);
      return new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }

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

  async findOne(term: UUID, tenantId: any): Promise<Partial<Client> | null> {
    let clientByTenantId: Partial<Client> | null = null;

    try {
      clientByTenantId = await this.clientRepository.findOne({
        where: {
          id: term,
          tenant: { id: tenantId }
        },
      })

      if (!clientByTenantId) throw new HttpException(`Client with ${term} not found`, HttpStatus.NOT_FOUND)

      return clientByTenantId;
    } catch (error) {
      console.log('finOne client', error);
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: UUID, tenantId: any, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id, tenantId);

    try {
      await this.clientRepository.update({ id: client?.id }, updateClientDto);
      return { msg: `client with name ${client?.id} updated`, status: HttpStatus.ACCEPTED };

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

  async verifyByTell(tel: string, tenantId: string): Promise<boolean | HttpException> {
    console.log("tel", tel);
    
    // let client: Client | null;
    // try {
    //   client = await this.clientRepository.findOne({
    //     where: {
    //       tenant: { id: tenantId },
    //       whatsapp: tel
    //     }
    //   })
    // } catch(error) {
    //   console.log('verifyByTell ', error);
    //   return new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR)    
    // }
    // if (!client) return false
    return true;
  }
}
