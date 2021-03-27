import { Inject, Injectable, Scope } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { UserEntity } from './user.entity';
import { TENANT_CONNECTION } from '../tenancy/tenancy.provider';
import { CreateUserDto, ReadUserDto } from './dto';
import { plainToClass } from 'class-transformer';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private readonly userRepository: Repository<UserEntity>;

  constructor(@Inject(TENANT_CONNECTION) connection: Connection) {
    this.userRepository = connection.getRepository(UserEntity);
  }

  async findAll(): Promise<ReadUserDto[]> {
    const users: UserEntity[] = await this.userRepository.find();

    return users.map((user: UserEntity) => plainToClass(ReadUserDto, user));
  }

  async create(user: CreateUserDto): Promise<ReadUserDto> {
    const createdUser = await this.userRepository.save(user);

    return plainToClass(ReadUserDto, createdUser);
  }
}
