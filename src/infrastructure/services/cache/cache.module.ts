import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ICacheService } from './cache.interface';
import { CacheService } from './cache.service';
import { EnvironmentConfigService } from '@config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory(configService: EnvironmentConfigService) {
        return new Redis({
          port: configService.getRedisPort(),
          host: configService.getRedisHost(),
          password: configService.getRedisPassword(),
          keyPrefix: configService.getRedisPrefix(),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: ICacheService,
      useClass: CacheService,
    },
  ],
  exports: [ICacheService],
})
export class CacheModule {}
