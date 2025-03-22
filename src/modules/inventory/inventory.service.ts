import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class InventoryService {

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) { }

  async create(createInventoryDto: CreateInventoryDto, tenantId: string) {
    const isProduct = await this.inventoryRepository.findOne({
      where: {
        name: createInventoryDto.name,
        tenant: { id: tenantId }
      }
    })

    if (isProduct) return new HttpException(`this product already exits in this tenant`, HttpStatus.CONFLICT);

    const newProduct = this.inventoryRepository.create({
      name: createInventoryDto.name,
      quantity: createInventoryDto.quantity,
      min_stock: createInventoryDto.min_stock,
      price: createInventoryDto.price,
      tenant: { id: tenantId }
    });

    try {
      await this.inventoryRepository.save(newProduct);
      return {
        msg: 'product created sussces',
        status: HttpStatus.CREATED
      }
    } catch (error) {
      console.log('create product', error);
      throw new HttpException('internar server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(tenantId: string) {
    try {
      const inventoryProducts = await this.inventoryRepository.find({
        select: {
          id: true,
          name: true,
          price: true,
          min_stock: true,
          quantity: true,
        },
        where: {
          tenant: { id: tenantId }
        },
        relations: ['supplier']
      })

      return inventoryProducts;
    } catch (error) {
      console.log('find all invetory products', error);
      throw new HttpException('internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async findOne(id: UUID, tenantId: string) {
    let inventoryProduct: Inventory | null = null;

    try {
      inventoryProduct = await this.inventoryRepository.findOne({
        where: {
          id,
          tenant: { id: tenantId }
        }
      })
      return inventoryProduct;
    } catch (error) {
      console.log('findOne inventory', error);
    }
    return `This action returns a #${id} inventory`;
  }

  async update(id: UUID, tenantId: string, updateInventoryDto: UpdateInventoryDto) {
    await this.findOne(id, tenantId);

    try {
      const updatedProduct = await this.inventoryRepository.update(id, updateInventoryDto);
      return {
        data: updatedProduct,
        msg: 'Product updated',
        status: HttpStatus.OK
      }
    } catch (error) {
      console.log('update iventory', error);
      throw new HttpException('internal server error', HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async remove(id: UUID, tenantId: string) {
    console.log(tenantId);
    
    await this.findOne(id, tenantId);

    try {
      await this.inventoryRepository.delete(id);
      return {
        msg: 'Product deleted',
        status: HttpStatus.NO_CONTENT
      }
    } catch (error) {
      console.log('Delete inventory', error);
      throw new HttpException('interal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
