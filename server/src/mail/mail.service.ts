import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  private transporter: Mail;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Yandex',
      auth: {
        user: `${process.env.MAIL_USER}`,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }
}
