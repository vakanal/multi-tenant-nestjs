import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection, getConnection } from 'typeorm';
import { Request } from 'express';
import { TenancyEntity } from './tenancy.entity';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

export const TenancyProvider: Provider = {
  provide: TENANT_CONNECTION,
  inject: [REQUEST, Connection],
  scope: Scope.REQUEST,
  useFactory: async (req: Request, connection: Connection) => {
    const name: string = req.params['tenant'];

    const tenant: TenancyEntity = await connection
      .getRepository(TenancyEntity)
      .findOne({ where: { name } });

    return getConnection(tenant.name);
  },
};
