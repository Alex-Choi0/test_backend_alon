import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    type: String,
    description: '이메일에 보낼 제목을 입력합니다.',
    example: 'Test Email',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: '이메일의 내용을 작성합니다.',
    example: '인증메일 테스트',
  })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    type: Array<String>,
    description: '정송할 이메일 주소를 입력합니다.',
    example: ['alex@gmail.com'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsEmail({}, { each: true })
  email: string[];
}
