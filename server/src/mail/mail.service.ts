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
  async sendActivationMail(email, activationLink) {
    this.transporter.sendMail({
      from: `${process.env.MAIL_USER}@yandex.ru`,
      to: email,
      subject: 'Активация аккаунта на Kasmusic',
      text: '',
      html: `
        <div>
          <h1>Перейдите по ссылке для завершения регистрации</h1>
          <a href="${activationLink}">${activationLink}</a>
        </div>
      `,
    });
  }
}
