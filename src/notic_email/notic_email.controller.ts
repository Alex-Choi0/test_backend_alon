import { Body, Controller, Inject, Post } from '@nestjs/common';
import { NoticEmailService } from './notic_email.service';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOneNoticEmailDto } from './dto/create-one-notic_email.dto';

@ApiTags('알람 이메일 API')
@Controller('notic-email')
export class NoticEmailController {
  constructor(
    @Inject(NoticEmailService)
    private readonly noticEmailService: NoticEmailService,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService
  ) { }

  private errorLocation = 'NoticEmailController';

  @Post('22/create/one')
  @ApiOperation({
    summary: '센서의 알림을 전달받아야 하는 유저(Email)를 생성한다. #22',
    description: '센서의 상태 변경 또는 오작동의 알림을 메일로 전달받을 사람을 생성한다.'
  })
  @ApiOkResponse({
    description: `정상적으로 응답시 \n
    {
      "id": 고유ID,
      "email": 알림용 Email,
      "name": 유저 이름,
      "mobile": 유저 전화번호,
      "available": 알림 가능유무,
      "createdAt": 레코드 생성 시간,
      "updatedAt": "레코드 업데이트 시간
    }
    `,
    schema: {
      example: {
        "id": 1,
        "email": "choijeaho86@gmail.com",
        "name": "Alex",
        "mobile": "01012345678",
        "available": true,
        "createdAt": "2026-03-11T01:48:48.012Z",
        "updatedAt": "2026-03-11T01:48:48.012Z"
      }
    }
  })
  async createOne(@Body() dto: CreateOneNoticEmailDto) {
    try {

      return await this.noticEmailService.createOne(dto);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

}
