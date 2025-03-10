import { UUID } from 'crypto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateBussinesServiceDto } from './dto/create-bussines-service.dto';
import { UpdateBussinesServiceDto } from './dto/update-bussines-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BussinesService } from './entities/bussines-service.entity';


@Injectable()
export class BussinesServices {
  constructor(
    @InjectRepository(BussinesService)
    private bussinesServiceRepository: Repository<BussinesService>,
  ) { }

  async create(createBussinesServiceDto: CreateBussinesServiceDto, tenantId: UUID | string): Promise<Partial<BussinesService>> {

    const newService = this.bussinesServiceRepository.create({
      name: createBussinesServiceDto.name,
      duration: createBussinesServiceDto.duration,
      price: createBussinesServiceDto.price,
      tenant: { id: tenantId }
    })

    try {
      await this.bussinesServiceRepository.save(newService)
    } catch (error) {
      console.log(error);
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return newService;
  }

  async findAll(tenantId: UUID | string): Promise<BussinesService[]> {

    try {
      const services = await this.bussinesServiceRepository.find({
        select: {
          name: true,
          duration: true,
          price: true,
        },
        where: {
          tenant: { id: tenantId }
        },
        relations: { tenant: true }
      })
      return services;
    } catch (error) {
      console.log('findAll services', error);
      throw new HttpException('internat server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(term: UUID, tenantId: UUID | string) {
    let service: BussinesService | null = null

    try {
      service = await this.bussinesServiceRepository.findOne({
        where: {
          id: term,
          tenant: { id: tenantId }
        }
      });
    } catch (error) {
      console.log('findOne service', error);
      return new HttpException('internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }


    if (!service) return new HttpException(`Tenant with ${term} not Found`, HttpStatus.NOT_FOUND)

    return service;
  }

  async update(id: UUID, updateBussinesServiceDto: UpdateBussinesServiceDto, tenantId: string | UUID) {
    await this.findOne(id, tenantId);
    try {

      const updatedSerice = await this.bussinesServiceRepository.update(id, updateBussinesServiceDto);
      return {
        msg: 'Service updated',
        data: updatedSerice
      }
    } catch (error) {
      return new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: UUID, tenantId: string) {
    await this.findOne(id, tenantId);
    try {
      await this.bussinesServiceRepository.delete(id);
      return {
        msg: 'Service deleted',
        status: HttpStatus.NO_CONTENT
      }
    } catch (error) {
      console.log('Delete service', error);
      throw new HttpException('interal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    };
  };
}
