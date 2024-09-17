import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Admin } from '../../src/infrastructure/entities/admin.entity';
import { BcryptService } from '../../src/infrastructure/services/bcrypt/bcrypt.service';

export default class EmOpEnvTypeSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    await dataSource.query('TRUNCATE TABLE `admins`');

    const repository = dataSource.getRepository(Admin);

    const bcryptService = new BcryptService();

    await repository.insert({
      name: 'admin',
      email: 'admin@gmail.com',
      password: await bcryptService.hash('admin@123'),
    });
  }
}
