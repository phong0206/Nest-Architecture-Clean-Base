import { Body, Controller, Get, Inject, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './auth-dto.class';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { AuthUsecases } from '@usecase/auth.usecases';
import { ApiController, ApiLogin } from '@common';
import { User } from '@entity/user.entity';
import { Admin } from '@entity/admin.entity';

@Controller('auth')
@ApiController('auth', [User, Admin])
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.AUTH_USECASES_PROXY)
    private readonly authUsecasesProxy: UseCaseProxy<AuthUsecases>,
  ) {}

  @ApiLogin('user', AuthLoginDto)
  async loginUser(@Body() auth: AuthLoginDto) {
    return this.authUsecasesProxy.getInstance().loginUser(auth);
  }

  @ApiLogin('admin', AuthLoginDto)
  async loginAdmin(@Body() auth: AuthLoginDto) {
    return this.authUsecasesProxy.getInstance().loginAdmin(auth);
  }
}
