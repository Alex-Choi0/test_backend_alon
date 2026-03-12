import { Controller, Inject, Param, Post } from '@nestjs/common';
import { TimerService } from './timer.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ServerErrorService } from 'src/server_error/server_error.service';

@ApiTags('[테스트 API] 날짜 시간 API')
@Controller('timer')
export class TimerController {
  constructor(
    @Inject(TimerService)
    private readonly timerService: TimerService,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService
  ) { }

  private errorLocation = 'TimerController';

  @Post('6/format/datetime/to-utc/:datetime')
  @ApiOperation({
    summary: '[테스트] 날짜 시간 string을 UTC string으로 변환을 테스트 하기위한 API #6',
  })
  @ApiParam({
    name: 'datetime',
    description: 'ISO 또는 타임존이 포함된 날짜시간 입력',
    example: '2026-03-08T09:00:00+09:00',
    required: true
  })
  async changeToUTC(@Param('datetime') datetime: string) {
    try {

      return this.timerService.changeToUTC(datetime);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }
}
