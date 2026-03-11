import { Controller, Get, Inject } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('statistics')
export class StatisticsController {
  constructor(
    @Inject(StatisticsService)
    private readonly statisticsService: StatisticsService,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService,
  ) { }

  private errorLocation = 'StatisticsController';

  @Get('36/total/sensor/status')
  @ApiOperation({
    summary: '등록된 센서의 상태를 응답한다. #36',
    description: '센서의 상태를 3가지(STANDBY - 등록됬으나 데이터를 수신받지 못함, NORMAL - 정상동작, MALFUNCTION - 오작동)로 분류후 총 대수를 응답. status상태가 없으면 생략한다.'
  })
  @ApiOkResponse({
    description: `정상적으로 동작시.\n
    {
      "standby": 0, // 대기상태 : 최초 센서를 등록하고 데이터를 받지 못한상태
      "normal": 3, // 정상상태 : 정해진 시간안에 데이터가 정상적으로 수신(서버기준).
      "malfunction": 1 // 누락(고장)상태 : 정해진 주기안에 데이터가 도작하지 않은 센서
    }
    `,
    schema: {
      example: {
        "standby": 0,
        "normal": 0,
        "malfunction": 4
      }
    }
  })
  async statusSensor() {
    try {

      return await this.statisticsService.getTotalSensorStatus();

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }
}
