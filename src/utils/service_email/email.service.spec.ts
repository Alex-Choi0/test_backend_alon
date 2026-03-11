import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { EmailService } from './email.service';

// Mock nodeMailer
jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    // Reset the mock before each test
    jest.resetAllMocks();

    // Create a new mocked implementation for createTransport
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: jest.fn().mockImplementation((mailOption, callback) => {
        // Simulate successful email sending
        callback(null, { response: 'Email sent successfully' });
      }),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendingEmail', () => {
    it('should send email successfully', async () => {
      // Arrange
      const mailOption = service.mailOpt(
        'Test Title',
        'Test Contents',
        ['test@example.com'],
      );

      // Act
      const result = await service.sendingEmail(mailOption);

      // Assert
      expect(result).toEqual({
        error: 'Email sent successfully',
        message: '전송완료',
      });
    });

    // Add more test cases for error scenarios if needed
  });

  describe('mailOpt', () => {
    it('should return mail options', () => {
      // Act
      const result = service.mailOpt(
        'Test Title',
        'Test Contents',
        ['test@example.com'],
      );

      // Assert
      expect(result).toEqual({
        from: process.env.EMAIL_USER,
        to: ['test@example.com'],
        subject: 'Test Title',
        text: 'Test Contents',
      });
    });
  });

  // describe('sendSignUpVerificationEmail', () => {
  //   it('should send signup verification email successfully', async () => {
  //     // Arrange
  //     const email = 'test@example.com';
  //     const name = 'Test User';
  //     const mockMailOptions = {
  //       from: process.env.EMAIL_USER,
  //       to: email,
  //       subject: '[Gobark] 회원가입을 위해 이메일 인증이 필요합니다.',
  //       text: '테스트 이메일',
  //       html: `
  //         <p>Test User님 안녕하세요.</p>
  //         <p>회원가입 절차를 완료하시려면 아래 버튼을 클릭해 주세요</p>
  //         <button>이메일 인증</button>
  //       `,
  //     };

  //     jest.spyOn(service, 'mailOptHtml').mockReturnValue(mockMailOptions);
  //     jest.spyOn(service, 'sendingEmail').mockResolvedValue(true);

  //     // Act
  //     const result = await service.sendSignUpVerificationEmail(email, name);

  //     // Assert
  //     expect(service.mailOptHtml).toHaveBeenCalledWith(
  //       '[Gobark] 회원가입을 위해 이메일 인증이 필요합니다.',
  //       '테스트 이메일',
  //       expect.any(String),
  //       email,
  //     );
  //     expect(service.sendingEmail).toHaveBeenCalledWith(mockMailOptions);
  //     expect(result).toBe(true);
  //   });

  //   it('should throw an error when sending email fails', async () => {
  //     // Arrange
  //     const email = 'test@example.com';
  //     const name = 'Test User';
  //     const mockError = new Error('Email sending failed');
  //     jest.spyOn(service, 'sendingEmail').mockRejectedValue(mockError);

  //     // Act & Assert
  //     await expect(
  //       service.sendSignUpVerificationEmail(email, name),
  //     ).rejects.toThrow('Email sending failed');
  //   });
  // });
});
