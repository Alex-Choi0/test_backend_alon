import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FindManySensorPayload {

  @ApiProperty({
    description: '여러개의 시리얼 번호를 입력한다. 빈 배열시 모든 시리얼 번호에 대해서 조회',
    type: Array,
    example: ['SANSOR-A-1004'],
    required: true
  })
  @IsNotEmpty()
  @IsString({ each: true })
  serial_numbers: string[];

}
