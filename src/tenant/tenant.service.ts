import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UUID } from 'crypto';
import { isString, isUUID } from 'class-validator';
import { ITenant } from './interfaces/tenant.interface';
import { CreateTenantDto } from './dto/create-tenant.dto';


@Injectable()
export class TenantService {

  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private authService: AuthService,
  ) { }


  async create(createTenantDto: CreateTenantDto) {
    console.log(createTenantDto);
    
    const isTenant = await this.tenantRepository.findOneBy({ subdomain: createTenantDto.subdomain});
    
    if (isTenant) return new HttpException(`Tenant ${isTenant.name} already used`, HttpStatus.CONFLICT);
    const tenant = this.tenantRepository.create(createTenantDto);

    Promise.all([
      await this.tenantRepository.save(tenant),
      await this.authService.register({ ...createTenantDto.adminData, tenant })
    ])

    return { tenant }
  }

  async findAll() {
    return await this.tenantRepository.find({
      select: {
        id: true,
        name: true,
        subdomain: true,
        logo: true,
        // colors: true,
      },
      withDeleted: false,
    });
  }

  async findOne(term: UUID | string): Promise<ITenant | null | HttpException> {
    let isTenant: ITenant | null = null;

    if (isString(term)) {
      isTenant = await this.tenantRepository.findOneBy({ subdomain: term })
    }

    if (isUUID(term)) {
      console.log(typeof term);
      isTenant = await this.tenantRepository.findOne({
        where: { id: term },
        cache: true,
      })
    }

    if (!isTenant) return new HttpException(`Tenant with ${term} not Found`, HttpStatus.NOT_FOUND)

    return isTenant
  }

  async update(id: UUID | string, updateTenantDto: UpdateTenantDto) {
    await this.findOne(id)
  
    await this.tenantRepository.update(id, updateTenantDto);

    return 
  }

  async remove(id: UUID | string) {
    const isUser = await this.findOne(id);
  
    if(isUser) return await this.tenantRepository.softRemove(isUser);
  }
}
