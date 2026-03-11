import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendingEmail(mailOption) {
    const mailPoster = nodeMailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // CICD로 배포시 인증문제있음 - 2중 인증
    return new Promise((resolve, reject) => {
      mailPoster.sendMail(mailOption, function (error, info) {
        console.log('Email user : ', process.env.EMAIL_USER);
        console.log('Email host : ', process.env.EMAIL_HOST);
        console.log('Email port : ', process.env.EMAIL_PORT);
        console.log('Email service : ', process.env.EMAIL_SERVICE);
        console.log('mailOpt : ', mailOption);
        // throw new error('임시 에러');
        console.log('메일 보내기');
        if (error) {
          console.log('에러 ' + error);
          reject({
            message: `이메일 전송 에러 : ${error}`,
          });
        } else {
          console.log('전송 완료 ' + info.response);
          resolve({
            message: '전송완료',
            error: info.response,
          });
        }
      });
    });

  }

  mailOpt(title: string, contents: string, to: string[]) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: title,
      text: contents,
    };

    console.log('');

    return mailOptions;
  }

  mailOptHtml(title: string, contents: string, html: string, to: string[]) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: title,
      text: contents,
      html,
    };

    return mailOptions;
  }


}
