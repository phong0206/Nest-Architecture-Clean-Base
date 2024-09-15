import { BaseService } from '@common';
import { User } from '@entity/user.entity';

export abstract class UserRepository extends BaseService<User> {}
