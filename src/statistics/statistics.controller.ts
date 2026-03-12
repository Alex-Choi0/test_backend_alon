import { Body, Controller, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { MODESELECT } from 'src/enum';
import { FindManySensorPayload } from 'src/sensor_payload/dto/find-many-sensor_payload.dto';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { StatisticsService } from './statistics.service';

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

  @Post('39/sensor-data/avg/mid/:sensorStartDate/:sensorEndDate/:modeSelect/:order/:orderColumn')
  @ApiOperation({
    summary: 'timestamp기준으로 각각의 데이터 평균과 중앙값을 응답 #39',
    description: '센서에서 작성된 시간(timestamp)기준으로 조회, 데이터(온도, 습도, 기압, 공기질)의 평균과 중위값을 응답한다. 1개의 시리얼 번호 또는 복수의 시리얼 번호로 선택이 가능하며 빈배열일시 시리얼 번호와 관계없이 해당기간의 평균을 응답한다.'
  })
  @ApiParam({
    name: 'sensorStartDate',
    description: '센서가 서버로 요청한 시작시간(timestamp)을 입력. 없을시 "-"입력. sensorStartDate 또는 sensorEndDate값이 "-"일 경우 센서 수집기간을 포함해서 조회하지 않는다.',
    type: String,
    example: '2024-05-22T08:30:00+09:00',
    required: true
  })
  @ApiParam({
    name: 'sensorEndDate',
    description: '센서가 서버로 요청한 끝나는 시간(timestamp)을 입력. 없을시 "-"입력. sensorStartDate 또는 sensorEndDate값이 "-"일 경우 센서 수집기간을 포함해서 조회하지 않는다.',
    type: String,
    example: '2024-05-24T08:30:00+09:00',
    required: true
  })
  @ApiParam({
    enum: MODESELECT,
    name: 'modeSelect',
    description: '조회할 모드. 전체로 선택하면 모드 상관없이 전체를 조회한다.',
    example: MODESELECT.전체,
    required: true
  })
  @ApiOkResponse({
    description: `정상적으로 응답시 \n
    {
      "temperature": { // 온도
        "avg": 평균값,
        "median": 중앙값
      },
      "humidity": { // 습도
        "avg": 평균값,
        "median": 중앙값
      },
      "pressure": { // 기압
        "avg": 평균값,
        "median": 중앙값
      },
      "airQuality": { // 공기질
        "avg": 평균값,
        "median": 중앙값
      }
    }
    `,
    example: {
      "temperature": {
        "avg": 26.833333333333332,
        "median": 25.5
      },
      "humidity": {
        "avg": 50.20000000000001,
        "median": 50.2
      },
      "pressure": {
        "avg": 1013.2000000000002,
        "median": 1013.2
      },
      "airQuality": {
        "avg": 42,
        "median": 42
      }
    }
  })
  @HttpCode(200)
  async getSensorDataAvgMidData(
    @Param('sensorStartDate') sensorStartDate: string,
    @Param('sensorEndDate') sensorEndDate: string,
    @Param('modeSelect') modeSelect: MODESELECT,
    @Body() dto: FindManySensorPayload
  ) {
    try {

      return await this.statisticsService.getSensorDataAvgMidData(sensorStartDate, sensorEndDate, dto.serial_numbers, modeSelect)


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  @Post('41/sensor-error-data/avg/mid/:startDate/:endDate/:modeSelect/:order/:orderColumn')
  @ApiOperation({
    summary: '서버에서 센서의 데이터를 수집한 기준(lastTime)으로 각각의 데이터 평균과 중앙값을 응답 #41',
    description: '서버에서 센서의 데이터를 수신한 시간(lastTime)기준으로 조회, 데이터(온도, 습도, 기압, 공기질, 누락시간)의 평균과 중위값을 응답한다. 1개의 시리얼 번호 또는 복수의 시리얼 번호로 선택이 가능하며 빈배열일시 시리얼 번호와 관계없이 해당기간의 평균을 응답한다.'
  })
  @ApiParam({
    name: 'startDate',
    description: '서버에서 센서의 데이터를 수신한 시작시간 입력. 없을시 "-"입력. startDate 또는 endDate값이 "-"일 경우 센서 수집기간을 포함해서 조회하지 않는다.',
    type: String,
    example: '2024-05-22T08:30:00+09:00',
    required: true
  })
  @ApiParam({
    name: 'endDate',
    description: '서버에서 센서의 데이터를 수신한 끝나는 시간 입력. 없을시 "-"입력. startDate 또는 endDate값이 "-"일 경우 센서 수집기간을 포함해서 조회하지 않는다.',
    type: String,
    example: '2024-05-24T08:30:00+09:00',
    required: true
  })
  @ApiParam({
    enum: MODESELECT,
    name: 'modeSelect',
    description: '조회할 모드. 전체로 선택하면 모드 상관없이 전체를 조회한다.',
    example: MODESELECT.전체,
    required: true
  })
  @ApiOkResponse({
    description: `정상적으로 응답시 \n
    {
      "temperature": { // 온도
        "avg": 평균값,
        "median": 중앙값
      },
      "humidity": { // 습도
        "avg": 평균값,
        "median": 중앙값
      },
      "pressure": { // 기압
        "avg": 평균값,
        "median": 중앙값
      },
      "airQuality": { // 공기질
        "avg": 평균값,
        "median": 중앙값
      },
      "delay_sec": { // 누락시간(초)
        "avg": 평균값,
        "median": 중앙값
      }
    }
    `,
    example: {
      "temperature": {
        "avg": 26.833333333333332,
        "median": 25.5
      },
      "humidity": {
        "avg": 50.20000000000001,
        "median": 50.2
      },
      "pressure": {
        "avg": 1013.2000000000002,
        "median": 1013.2
      },
      "airQuality": {
        "avg": 42,
        "median": 42
      },
      "delay_sec": {
        "avg": 17.666666666666668,
        "median": 17
      }
    }
  })
  @HttpCode(200)
  async getSensorErrorDataAvgMidData(
    @Param('startDate') sensorStartDate: string,
    @Param('endDate') sensorEndDate: string,
    @Param('modeSelect') modeSelect: MODESELECT,
    @Body() dto: FindManySensorPayload
  ) {
    try {

      return await this.statisticsService.getSensorErrorDataAvgMidData(sensorStartDate, sensorEndDate, dto.serial_numbers, modeSelect)


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }
}
