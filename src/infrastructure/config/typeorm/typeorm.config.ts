import { DataSourceOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export function getConfig() {
  return {
    type: process.env.DATABASE_ENGINE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + './../../**/*.entity{.ts,.js}'],
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    schema: process.env.DATABASE_SCHEMA,
    migrationsRun: true,
    migrations: ['database/migrations/**/*{.ts,.js}'],
    subscribers: ['src/migrations'],
    extra: {
      connectionLimit: 3,
    },
    seeds: ['database/seeds/**/*{.ts,.js}'],
    seedTracking: true,
  } as DataSourceOptions;
}

const datasource = new DataSource(getConfig());

datasource.initialize();

export default datasource;
