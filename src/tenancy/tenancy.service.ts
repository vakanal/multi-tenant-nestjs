import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenancyEntity } from './tenancy.entity';
import { ReadTenancyDto, CreateTenancyDto } from './dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TenancyService {
  constructor(
    @InjectRepository(TenancyEntity)
    private readonly tenancyRepository: Repository<TenancyEntity>,
  ) {}

  async findAll(): Promise<ReadTenancyDto[]> {
    const tenants: TenancyEntity[] = await this.tenancyRepository.find();

    return tenants.map((tenant: TenancyEntity) =>
      plainToClass(ReadTenancyDto, tenant),
    );
  }

  async findOne(name: string): Promise<ReadTenancyDto> {
    const tenantByName: TenancyEntity = await this.tenancyRepository.findOne({
      where: { name },
    });

    return plainToClass(ReadTenancyDto, tenantByName);
  }

  async create(tenant: CreateTenancyDto): Promise<ReadTenancyDto> {
    const createdTenant: TenancyEntity = await this.tenancyRepository.save(
      tenant,
    );

    return plainToClass(ReadTenancyDto, createdTenant);
  }
}
