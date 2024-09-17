import { EnvironmentConfigModule, EnvironmentConfigService } from '@config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module, Global } from '@nestjs/common';
import { SESClient } from '@aws-sdk/client-ses';
import { IMailService } from './mail.interface';
import { MailService } from './mail.service';
import { ExceptionsModule } from 'src/infrastructure/exceptions/exceptions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';

export const getMailerConfigSES = (configService: EnvironmentConfigService) => {
  const regionSES = configService.getSESRegion();
  if (regionSES) {
    return {
      transport: {
        SES: { ses: new SESClient({ region: regionSES }) },
      },
      defaults: {
        from: configService.getMailFrom(),
      },
    };
  } else {
    return {
      transport: {
        host: configService.getHostMailer(),
        port: configService.getPortMailer(),
        secure: Boolean(configService.getPortMailer() === 465),
      },
      defaults: {
        from: configService.getMailFrom(),
      },
    };
  }
};

@Global()
@Module({
  providers: [
    {
      provide: IMailService,
      useClass: MailService, // Use your custom mail service instead of NodemailerService
    },
    MailService,
  ],
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (configService: EnvironmentConfigService) => {
        return getMailerConfigSES(configService);
      },
    }),
    ExceptionsModule,
    LoggerModule,
    EnvironmentConfigModule,
  ],
  exports: [IMailService, MailService],
})
export class MailModule {}
