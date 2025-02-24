import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { TenantMiddleware } from './middleware/tenat.middleware';

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
        synchronize: true, // Solo para desarrollo
        // logging: true, // Log querys only for test
      }),
    }),
    AuthModule,
    TenantModule,
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
