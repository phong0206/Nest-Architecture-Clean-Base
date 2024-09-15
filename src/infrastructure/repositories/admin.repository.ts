import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '@entity/admin.entity';
import { AdminRepository } from '@repository/adminRepository.interface';

@Injectable()
export class DatabaseAdminRepository extends AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminEntityRepository: Repository<Admin>,
  ) {
    super(adminEntityRepository);
  }
  notFoundMessage = 'Admin not found.';
}
