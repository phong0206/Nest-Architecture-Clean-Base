import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseUserRepository } from './user.repository';
import { TypeOrmConfigModule } from '@config';
import { User } from '@entity/user.entity';
import { Admin } from '@entity/admin.entity';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { DatabaseAdminRepository } from './admin.repository';
import { ImageUpload } from '@entity/image.entity';
import { DatabaseImageUploadRepository } from './image.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User, Admin, ImageUpload]), ExceptionsModule],
  providers: [DatabaseUserRepository, DatabaseAdminRepository, DatabaseImageUploadRepository],
  exports: [DatabaseUserRepository, DatabaseAdminRepository, DatabaseImageUploadRepository],
})
export class RepositoriesModule {}
