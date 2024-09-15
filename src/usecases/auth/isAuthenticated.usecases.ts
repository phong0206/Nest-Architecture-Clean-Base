import { User } from '@entity/user.entity';
import { UserRepository } from '../../domain/repositories/userRepository.interface';

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: UserRepository) {}

  async execute(username: string): Promise<any> {
    // const user: User = await this.adminUserRepo.getUserByUsername(username);
    // const { password, ...info } = user;
    // return info;
  }
}
