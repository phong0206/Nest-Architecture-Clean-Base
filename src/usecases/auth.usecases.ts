import { Admin } from '@entity/admin.entity';
import { User } from '@entity/user.entity';
import { AdminRepository } from '@repository/adminRepository.interface';
import { UserRepository } from '@repository/userRepository.interface';
import { IJwtService, IJwtServicePayload } from 'src/domain/adapters/jwt.interface';
import { JWTConfig } from 'src/domain/config/jwt.interface';
import { AuthLoginDto, AuthSignupDto } from 'src/infrastructure/controllers/auth/auth-dto.class';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';

export class AuthUsecases {
  constructor(
    private readonly exceptionsService: ExceptionsService,
    private readonly adminRepository: AdminRepository,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtConfig: JWTConfig,
    private readonly jwtTokenService: IJwtService,
  ) {}

  //logout
  async logoutUser(userId: number): Promise<User> {
    return this.userRepository.updateById(userId, { access_token: null, refresh_token: null });
  }

  async logoutAdmin(adminId: number): Promise<Admin> {
    return this.adminRepository.updateById(adminId, { access_token: null, refresh_token: null });
  }

  //login
  async loginUser(auth: AuthLoginDto) {
    const { email, password } = auth;

    const user = await this.userRepository.getOneOrFail({ where: { email } });

    const isPasswordValid = await this.bcryptService.compare(password, user.password);
    if (!isPasswordValid) this.exceptionsService.unauthorizedException({ message: 'Password Incorrect' });

    const [accessToken, refreshToken] = await Promise.all([
      this.getCookieWithJwtToken(email, 'user'),
      this.getCookieWithJwtRefreshToken(email, 'user'),
    ]);
    await this.userRepository.update({ where: { email } }, { access_token: accessToken, refresh_token: refreshToken });
    return { accessToken, refreshToken };
  }

  async loginAdmin(auth: AuthLoginDto) {
    const { email, password } = auth;

    const admin = await this.adminRepository.getOneOrFail({ where: { email } });

    const isPasswordValid = await this.bcryptService.compare(password, admin.password);
    if (!isPasswordValid) this.exceptionsService.unauthorizedException({ message: 'Password Incorrect' });

    const [accessToken, refreshToken] = await Promise.all([
      this.getCookieWithJwtToken(email, 'admin'),
      this.getCookieWithJwtRefreshToken(email, 'admin'),
    ]);
    await this.adminRepository.update({ where: { email } }, { access_token: accessToken, refresh_token: refreshToken });
    return { accessToken, refreshToken };
  }

  //sign up
  async signUpUser(input: AuthSignupDto) {
    const { email } = input;
    const existsUser = await this.userRepository.getOne({ where: { email } });
    if (existsUser) this.exceptionsService.badRequestException({ message: 'User already exists.' });
    input.password = await this.bcryptService.hash(input.password);
    return this.userRepository.create(input);
  }

  private async getCookieWithJwtToken(email: string, typeLogin: string) {
    const payload: IJwtServicePayload = { email, type: typeLogin };
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
    return this.jwtTokenService.createToken(payload, secret, expiresIn);
  }

  private async getCookieWithJwtRefreshToken(email: string, typeLogin: string) {
    const payload: IJwtServicePayload = { email, type: typeLogin };
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
    return this.jwtTokenService.createToken(payload, secret, expiresIn);
  }
}
