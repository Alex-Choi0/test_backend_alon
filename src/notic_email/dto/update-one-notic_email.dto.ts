import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOneNoticEmailDto } from './create-one-notic_email.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateOneNoticEmailDto extends PartialType(CreateOneNoticEmailDto) {
  @ApiProperty({
    description: '알림 전송 유무설정. true이면 알림이 메일로 전송',
    type: Boolean,
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  available: boolean;
}
