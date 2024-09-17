import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { LoggerService } from '../../logger/logger.service';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { AuthUsecases } from '@usecase/auth.usecases';

@Injectable()
export class AdminJwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'admin-jwt-refresh-token') {
  constructor(
    @Inject('AuthUsecasesProxy')
    private readonly authUsecasesProxy: UseCaseProxy<AuthUsecases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const user = await this.authUsecasesProxy.getInstance().validateAdminForJWTStrategy(payload.email);
    const refreshToken = request.headers['authorization'].replace('Bearer ', '');
    if (!user || payload.type !== 'admin' || user.refresh_token !== refreshToken) {
      this.logger.warn('JwtStrategy', `Admin not found`);
      this.exceptionService.unauthorizedException({ message: 'Your login session has expired.' });
    }
    return user;
  }
}