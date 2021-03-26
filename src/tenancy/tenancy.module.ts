import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenancyEntity } from './tenancy.entity';
import { TenancyController } from './tenancy.controller';
import { TenancyService } from './tenancy.service';
import { TenancyMiddleware } from './tenancy.middleware';
import { TenancyProvider } from './tenancy.provider';

@Module({
  imports: [TypeOrmModule.forFeature([TenancyEntity])],
  providers: [TenancyService, TenancyProvider],
  controllers: [TenancyController],
})
export class TenancyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenancyMiddleware)
      .exclude({ path: '/api/tenants', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
