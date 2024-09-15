import { SentMessageInfo } from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';

export abstract class IMailService {
  /**
   * @param options
   * @return Promise<SentMessageInfo>
   * @example options = {templateHtmlPath: './templates/example.html',...}
   * @example this.mailService.sendMailSES(options);
   */

  abstract sendMailSES(options: MailOptions): Promise<SentMessageInfo>;

  /**
   * @param mailConfig
   * @param options
   * @return Promise<SentMessageInfo>
   * @example this.mailService.sendMailCustom(mailConfig, options);
   */
  abstract sendMailCustom(mailConfig: SMTPConnection.Options, options: MailOptions): Promise<SentMessageInfo>;
}
