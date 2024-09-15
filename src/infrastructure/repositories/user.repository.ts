import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entity/user.entity';
import { UserRepository } from '@repository/userRepository.interface';

@Injectable()
export class DatabaseUserRepository extends UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {
    super(userEntityRepository);
  }
  notFoundMessage = 'User not found.';
}
