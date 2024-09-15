import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigModule, EnvironmentConfigService } from '@config';

export const getTypeOrmModuleOptions = (config: EnvironmentConfigService): TypeOrmModuleOptions =>
  ({
    type: config.getDatabaseEngine(),
    entities: [__dirname + './../../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    subscribers: ['src/migrations'],
    replication: {
      master: {
        host: config.getDatabaseHost(),
        port: config.getDatabasePort(),
        username: config.getDatabaseUser(),
        password: config.getDatabasePassword(),
        database: config.getDatabaseName(),
        synchronize: false,
        schema: process.env.DATABASE_SCHEMA,
        migrationsRun: true,
      },
      slaves: [
        {
          host: config.getDatabaseHost(),
          port: config.getDatabasePort(),
          username: config.getDatabaseUser(),
          password: config.getDatabasePassword(),
          database: config.getDatabaseName(),
          synchronize: false,
          schema: process.env.DATABASE_SCHEMA,
          migrationsRun: false,
        },
      ],
    },
  }) as TypeOrmModuleOptions;
@Module({
  imports: [
    forwardRef(() =>
      TypeOrmModule.forRootAsync({
        imports: [EnvironmentConfigModule],
        inject: [EnvironmentConfigService],
        useFactory: getTypeOrmModuleOptions,
      }),
    ),
  ],
})
export class TypeOrmConfigModule {}
