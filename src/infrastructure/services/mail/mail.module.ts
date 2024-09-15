import { EnvironmentConfigService } from '@config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module, Global } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { IMailService } from './mail.interface';
import { MailService } from './mail.service';

export const getMailerConfigSES = (configService: EnvironmentConfigService) => {
  return {
    transport: {
      SES: new AWS.SES({
        region: configService.getSESRegion(),
      }),
    },
    defaults: {
      from: configService.getMailFrom(),
    },
  };
};

@Global()
@Module({
  providers: [
    {
      provide: IMailService,
      useClass: MailService, // Use your custom mail service instead of NodemailerService
    },
  ],
  imports: [
    MailerModule.forRootAsync({
      inject: [EnvironmentConfigService],
      useFactory: (configService: EnvironmentConfigService) => {
        return getMailerConfigSES(configService);
      },
    }),
  ],
  exports: [IMailService],
})
export class MailModule {}
