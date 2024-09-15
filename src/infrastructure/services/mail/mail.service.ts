import { Injectable } from '@nestjs/common';
import { IMailService } from './mail.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { createTransport, SentMessageInfo } from 'nodemailer';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class MailService extends IMailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly exceptionService: ExceptionsService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async sendMailSES(options: MailOptions): Promise<SentMessageInfo> {
    try {
      const { templateHtmlPath, html, ...mailOptions } = options;
      const emailHtml = templateHtmlPath ? await this.readTemplate(templateHtmlPath) : html;

      return this.mailerService.sendMail({
        ...mailOptions,
        html: emailHtml,
      });
    } catch (error) {
      this.logger.error(`Failed to send mail: ${options.subject}`, error.stack);
      this.exceptionService.badRequestException({ message: 'Failed to send email.' });
    }
  }

  async sendMailCustom(mailConfig: SMTPConnection.Options, options: MailOptions): Promise<SentMessageInfo> {
    try {
      const transporter = createTransport(mailConfig);
      const { templateHtmlPath, html, ...mailOptions } = options;
      const emailHtml = templateHtmlPath ? await this.readTemplate(templateHtmlPath) : html;

      return transporter.sendMail({
        ...mailOptions,
        html: emailHtml,
      });
    } catch (error) {
      this.logger.error(`Failed to send mail: ${options?.subject}`, error.stack);
      throw new Error(`Failed to send email via custom SMTP: ${error.message}`);
    }
  }

  private async readTemplate(path: string): Promise<string> {
    const fs = require('fs').promises;
    return fs.readFile(path, 'utf8');
  }
}
