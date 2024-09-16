/* eslint-disable prettier/prettier */
import { DynamicModule, forwardRef, Module } from '@nestjs/common';

import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { JwtModule } from '../services/jwt/jwt.module';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { RepositoriesModule } from '../repositories/repositories.module';

import { DatabaseUserRepository } from '../repositories/user.repository';

import { UseCaseProxy } from './usecases-proxy';
import { EnvironmentConfigModule, EnvironmentConfigService } from '@config';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { DatabaseAdminRepository } from '../repositories/admin.repository';
import { AuthUsecases } from '@usecase/auth.usecases';

@Module({
  imports: [LoggerModule, JwtModule, BcryptModule, EnvironmentConfigModule, RepositoriesModule, ExceptionsModule],
})
export class UsecasesProxyModule {
  static AUTH_USECASES_PROXY = 'AuthUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [
            ExceptionsService,
            DatabaseAdminRepository,
            DatabaseUserRepository,
            BcryptService,
            EnvironmentConfigService,
            JwtTokenService,
          ],
          provide: UsecasesProxyModule.AUTH_USECASES_PROXY,
          useFactory: (
            exceptionsService: ExceptionsService,
            adminRepo: DatabaseAdminRepository,
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
            jwtConfig: EnvironmentConfigService,
            jwtTokenService: JwtTokenService,
          ) =>
            new UseCaseProxy(
              new AuthUsecases(exceptionsService, adminRepo, userRepo, bcryptService, jwtConfig, jwtTokenService),
            ),
        },
      ],
      exports: [UsecasesProxyModule.AUTH_USECASES_PROXY],
    };
  }
}
