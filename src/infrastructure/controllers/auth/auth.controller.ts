import { Body, Controller, Get, Inject, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto, AuthSignupDto, ResetPasswordDto } from './auth-dto.class';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { AuthUsecases } from '@usecase/auth.usecases';
import {
  AdminJwtRefreshGuard,
  AdminJwtAuthGuard,
  ApiController,
  ApiGetOne,
  ApiLogin,
  ApiLogout,
  ApiSignUp,
  ApiUpdate,
  JwtAuthGuard,
  JwtRefreshGuard,
} from '@common';
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

  @ApiLogout('user', JwtAuthGuard)
  async logoutUser(@Req() req: any) {
    await this.authUsecasesProxy.getInstance().logoutUser(req.user?.id);
    return 'Logout successfully';
  }

  @ApiLogout('admin', AdminJwtAuthGuard)
  async logoutAdmin(@Req() req: any) {
    await this.authUsecasesProxy.getInstance().logoutAdmin(req.user?.id);
    return 'Logout successfully';
  }

  @ApiSignUp(AuthSignupDto)
  async signupUser(@Body() input: AuthSignupDto) {
    await this.authUsecasesProxy.getInstance().signUpUser(input);
    return 'Sign up successfully.';
  }

  @Post('user/reset_password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUpdate('password')
  async resetPassword(@Body() body: ResetPasswordDto, @Req() req: any) {
    await this.authUsecasesProxy.getInstance().resetPassword(body.password, req?.user?.email);
    return 'Reset password successfully.';
  }

  @Get('user/refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiGetOne(undefined, 'access token')
  async refreshUser(@Req() req: any) {
    return this.authUsecasesProxy.getInstance().refreshTokenUser(req.user?.email);
  }

  @Get('admin/refresh')
  @UseGuards(AdminJwtRefreshGuard)
  @ApiBearerAuth()
  @ApiGetOne(undefined, 'access token')
  async refreshAdmin(@Req() req: any) {
    return this.authUsecasesProxy.getInstance().refreshTokenAdmin(req.user?.email);
  }
}
