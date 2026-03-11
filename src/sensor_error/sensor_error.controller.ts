import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { SensorErrorService } from './sensor_error.service';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { MODESELECT, OrderEnum } from 'src/enum';
import { SensorErrorColumns } from './entities/sensor_error.entity';

@ApiTags('센서의 오작동 로그를 기록 조회하는 API')
@Controller('sensor-error')
export class SensorErrorController {
  constructor(
    @Inject(SensorErrorService)
    private readonly sensorErrorService: SensorErrorService,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService
  ) { }

  private errorLocation = 'SensorErrorController';

  @Get('19/find/many/:startDate/:endDate/:sensorStartDate/:sensorEndDate/:skip/:take/:serial_number/:modeSelect/:order/:orderColumn')
  @ApiOperation({
    summary: '센서 오작동에 대한 조회를 한다. #19',
    description: '센서 오작동에 대한 조회를 한다.'
  })
  @ApiParam({
    name: 'startDate',
    description: '서버 수집시간중 조회할 시작시간을 입력. 없을시 "-"입력. startDate 또는 endDate값이 "-"일 경우 서버 수집기간을 포함해서 조회하지 않는다.',
    type: String,
    example: '2024-05-22T08:30:00+09:00',
    required: true
  })
  @ApiParam({
    name: 'endDate',
    description: '서버 수집시간중 조회할 끝나는 시간을 입력. 없을시 "-"입력. startDate 또는 endDate값이 "-"일 경우 서버 수집기간을 포함해서 조회하지 않는다.',
    type: String,
    example: '2024-05-24T08:30:00+09:00',
    required: true,
  })
  @ApiParam({
    name: 'sensorStartDate',
    description: '센서 수집시간중 조회할 시작시간을 입력. 없을시 "-"입력. sensorStartDate 또는 sensorEndDate값이 "-"일 경우 센서 수집기간을 포함해서 조회하지 않는다.',
    type: String,
    example: '2024-05-22T08:30:00+09:00',
    required: true
  })
  @ApiParam({
    name: 'sensorEndDate',
    description: '센서 수집시간중 조회할 끝나는 시간을 입력. 없을시 "-"입력. sensorStartDate 또는 sensorEndDate값이 "-"일 경우 센서 수집기간을 포함해서 조회하지 않는다.',
    type: String,
    example: '2024-05-24T08:30:00+09:00',
    required: true
  })
  @ApiParam({
    type: Number,
    name: 'skip',
    description: '건너띌 record. 0이면 처음 조회값으로 시작',
    example: 0,
    required: true
  })
  @ApiParam({
    type: Number,
    name: 'take',
    description: '불러올 record. 5이면 skip을 제와한 다음의 조회값 5개를 불러온다.',
    example: 5,
    required: true
  })
  @ApiParam({
    type: String,
    name: 'serial_number',
    description: '조회할 시리얼 번호. "-" 입력시 시리얼 번호와 관계없이 조회',
    example: 'SANSOR-A-1005',
    required: true
  })
  @ApiParam({
    enum: MODESELECT,
    name: 'modeSelect',
    description: '조회할 모드. 전체로 선택하면 모드 상관없이 전체를 조회한다.',
    example: MODESELECT.전체,
    required: true
  })
  @ApiParam({
    enum: OrderEnum,
    name: 'order',
    description: '정렬방법. DESC : 내림차순, ASC : 오름차순',
    example: OrderEnum.DESC,
    required: true
  })
  @ApiParam({
    enum: SensorErrorColumns,
    name: 'orderColumn',
    description: '정렬할 컬럼',
    example: SensorErrorColumns.id,
    required: true
  })
  @ApiOkResponse({
    description: `정상적으로 응답시 \n
    [
      [
        "id": 센서에러 ID,
        "serial_number": 센서 시리얼 번호,
        "lastPayLoadId": 센서 수신 ID,
        "lastMode": 에러가 생기기전 마지막 모드,
        "lastTime": 센서에 기록된 마지막 시간,
        "delay_sec": 오류로 판정되기까지 지난 시간,
        "createdAt": 서버에 생성된 시간,
        "updatedAt": 서버에 업데이트된 시간,
        "lastPayload" : { // sensor_payload에서 lastPayLoadId의 레코드
          "id": 센서 수집 ID,
          "serial_number": 센서 시리얼 번호,
          "timestamp": 센서에 의해 작성된 시간(UTC),
          "mode": 센서모드,
          "temperature": 온도,
          "humidity": 습도,
          "pressure": 기압,
          "locationLat": 위도,
          "locationLng": 경도,
          "airQuality": 공기질 지수,
          "createdAt": 서버에 의해 해당 레코드가 생성된 시간(UTC),
          "updatedAt": 서버에 의해 해당 레코드가 업데이트 된 시간(UTC)
        }
      ],
      해당 조건으로 조회시 총 갯수
    ]
    `,
    schema: {
      example: [
        [
          {
            "id": 2,
            "serial_number": "SANSOR-A-1004",
            "lastPayLoadId": 3,
            "lastMode": "EMERGENCY",
            "lastTime": "2026-03-10T23:49:01.516Z",
            "delay_sec": 18,
            "createdAt": "2026-03-10T23:49:20.008Z",
            "updatedAt": "2026-03-10T23:49:20.008Z",
            "lastPayload": {
              "id": 3,
              "serial_number": "SANSOR-A-1004",
              "timestamp": "2024-05-22T23:30:00.000Z",
              "mode": "EMERGENCY",
              "temperature": 24.5,
              "humidity": 50.2,
              "pressure": 1013.2,
              "locationLat": 37.5665,
              "locationLng": 126.978,
              "airQuality": 42,
              "createdAt": "2026-03-10T23:49:01.516Z",
              "updatedAt": "2026-03-10T23:49:01.516Z"
            }
          }
        ],
        1
      ]
    }
  })
  async findManyByOption(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Param('sensorStartDate') sensorStartDate: string,
    @Param('sensorEndDate') sensorEndDate: string,
    @Param('skip') skip: number,
    @Param('take') take: number,
    @Param('serial_number') serial_number: string,
    @Param('modeSelect') modeSelect: MODESELECT,
    @Param('order') order: OrderEnum,
    @Param('orderColumn') orderColumn: SensorErrorColumns
  ) {
    try {

      return await this.sensorErrorService.findManyByOptions(
        serial_number,
        startDate,
        endDate,
        sensorStartDate,
        sensorEndDate,
        skip,
        take,
        modeSelect,
        order,
        orderColumn
      );


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

}
