import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { Tenant } from './entities/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { BussinesServicesModule } from 'src/modules/bussines-services/bussines-services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    AuthModule,
    ClientsModule,
    // BussinesServicesModule
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService]
})
export class TenantModule {}
