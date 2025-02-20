import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { Tenant } from './entities/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    AuthModule
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService]
})
export class TenantModule {}
