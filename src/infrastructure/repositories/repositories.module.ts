import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseUserRepository } from './user.repository';
import { TypeOrmConfigModule } from '@config';
import { User } from '@entity/user.entity';
import { Admin } from '@entity/admin.entity';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { DatabaseAdminRepository } from './admin.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User, Admin]), ExceptionsModule],
  providers: [DatabaseUserRepository, DatabaseAdminRepository],
  exports: [DatabaseUserRepository, DatabaseAdminRepository],
})
export class RepositoriesModule {}
