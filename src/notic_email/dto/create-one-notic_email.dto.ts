import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOneNoticEmailDto {
  @ApiProperty({
    description: '유저의 이메일 - 고유해야함',
    type: String,
    example: 'choijeaho86@gmail.com',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '이메일 주인의 이름',
    type: String,
    example: 'Alex',
    required: false
  })
  @IsOptional()
  @IsString()
  name: string | null;

  @ApiProperty({
    description: '이메일 주인의 전화번호',
    type: String,
    example: '01012345678',
    required: false
  })
  @IsOptional()
  @IsString()
  mobile: string | null;

}
