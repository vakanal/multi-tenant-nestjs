import { Module } from '@nestjs/common';
import { TenancyModule } from '../tenancy/tenancy.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TenancyModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
