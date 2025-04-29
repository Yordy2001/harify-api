import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { TenantMiddleware } from './shared/middleware/tenat.middleware';
import { ClientsModule } from './modules/clients/clients.module';
import { BussinesServicesModule } from './modules/bussines-services/bussines-services.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PrinterModule } from './shared/printer/printer.module';
import { EmployeesModule } from './modules/employees/employees.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // develop mode only
      //  logging: true, // Log querys only for test
      }),
    }),
    AuthModule,
    TenantModule,
    ClientsModule,
    BussinesServicesModule,
    InventoryModule,
    AppointmentModule,
    InvoiceModule,
    ReportsModule,
    PrinterModule,
    EmployeesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware)
    .exclude(
      {path: 'tenant', method: RequestMethod.POST},
      {path: 'auth', method: RequestMethod.POST},
    )
    .forRoutes(
      { path: 'tenant', method: RequestMethod.GET },
      { path: 'user', method: RequestMethod.GET }
    )
  }
}
