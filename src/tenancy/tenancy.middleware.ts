import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { Connection, createConnection, getConnection } from 'typeorm';
import { TenancyService } from './tenancy.service';
import { TenancyEntity } from './tenancy.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly connection: Connection,
    private readonly tenancyService: TenancyService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const name: string = req.params['tenant'];

    const tenant: TenancyEntity = await this.tenancyService.findOne(name);

    if (!tenant) {
      throw new BadRequestException();
    }

    try {
      getConnection(tenant.name);
      next();
    } catch (e) {
      await this.connection.query(
        `CREATE DATABASE IF NOT EXISTS ${tenant.name}`,
      );

      const createdConnection: Connection = await createConnection({
        name: tenant.name,
        type: 'mysql',
        host: this.configService.get('DB_HOST'),
        port: +this.configService.get<number>('DB_PORT'),
        username: this.configService.get('DB_USER'),
        password: this.configService.get('DB_PASSWORD'),
        database: tenant.name,
        entities: [UserEntity],
        synchronize: true,
      });

      if (createdConnection) {
        next();
      } else {
        throw new BadRequestException();
      }
    }
  }
}
