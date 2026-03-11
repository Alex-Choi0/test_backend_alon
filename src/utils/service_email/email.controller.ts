import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from './dto/send_email.dto';
import { EmailService } from './email.service';

@ApiTags('Test API Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('28')
  @ApiOperation({
    summary: '[테스트용 API] 검증 이메일(테스트 용도)을 보낸다. #28',
    description: '테스트용 API. title, body, email을 입력해서 메일로 보낸다.',
  })
  async sendCheckEmail(@Body() dto: SendEmailDto) {
    const { title, body, email } = dto;
    return {
      result: await this.emailService.sendManyEmails(title, body, email),
      message: '전송완료',
    };
  }
}
