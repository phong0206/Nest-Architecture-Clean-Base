import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { LoggerService } from '../../logger/logger.service';
import { ExceptionsService } from '../../exceptions/exceptions.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: EnvironmentConfigService,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    // const refreshToken = request.cookies?.Refresh;
    // const user = this.loginUsecaseProxy.getInstance().getUserIfRefreshTokenMatches(refreshToken, payload.username);
    // if (!user) {
    //   this.logger.warn('JwtStrategy', `User not found or hash not correct`);
    //   this.exceptionService.unauthorizedException({
    //     message: 'User not found or hash not correct',
    //   });
    // }
    // return user;
  }
}
