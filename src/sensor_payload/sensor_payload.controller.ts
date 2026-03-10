import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { CreateOneSensorPayloadDto } from './dto/create-one-sensor_payload.dto';
import { SensorPayloadService } from './sensor_payload.service';
import { MODESELECT, OrderEnum } from 'src/enum';
import { SensorPayloadColumns } from './entities/sensor_payload.entity';

@ApiTags('센서 데이터를 수집하고 조회하는 API')
@Controller('sensor-payload')
export class SensorPayloadController {
  constructor(
    @Inject(SensorPayloadService)
    private readonly sensorPayloadService: SensorPayloadService,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService,
  ) { }

  private errorLocation = 'SensorPayloadController';

  @Post('4/create/one')
  @ApiOperation({
    summary: '하나의 센서가 하나의 데이터를 전송한다. #4',
    description: '하나의 센서가 단일 데이터를 전송한다. sensor에 등록되어 있어야 한다.'
  })
  @ApiCreatedResponse({
    description: `정상적으로 저장시\n
    {
      "id": 데이터 ID,
      "serial_number": 센서의 시리얼 번호,
      "timestamp": 센서 기준 데이터 생성 시간,
      "mode": 작동모드,
      "temperature": 온도,
      "humidity": 습도,
      "pressure": 기압,
      "locationLat": 위도,
      "locationLng": 경도,
      "airQuality": 공기질 지수,
      "createdAt": 레코드 생성시간,
      "updatedAt": 레코드 수정시간
    }
    `,
    schema: {
      example: {
        "id": 4,
        "serial_number": "SANSOR-A-1004",
        "timestamp": "2024-05-22T23:30:00.000Z",
        "mode": "NORMAL",
        "temperature": 24.5,
        "humidity": 50.2,
        "pressure": 1013.2,
        "locationLat": 37.5665,
        "locationLng": 126.978,
        "airQuality": 3,
        "createdAt": "2026-03-09T12:52:45.075Z",
        "updatedAt": "2026-03-09T12:52:45.075Z"
      }
    }
  })
  async createOne(@Body() dto: CreateOneSensorPayloadDto) {
    try {

      return await this.sensorPayloadService.createOne(dto);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  @Post('5/create/many')
  @ApiOperation({
    summary: '하나의 센서가 여러개의 데이터를 전송한다. #5',
    description: '하나의 센서가 여러개의 데이터를 배열로 전송한다.'
  })
  @ApiCreatedResponse({
    description: `정상적으로 저장시\n
    [{
      "id": 데이터 ID,
      "serial_number": 센서의 시리얼 번호,
      "timestamp": 센서 기준 데이터 생성 시간,
      "mode": 작동모드,
      "temperature": 온도,
      "humidity": 습도,
      "pressure": 기압,
      "locationLat": 위도,
      "locationLng": 경도,
      "airQuality": 공기질 지수,
      "createdAt": 레코드 생성시간,
      "updatedAt": 레코드 수정시간
    }]
    `,
    schema: {
      example: {
        "id": 4,
        "serial_number": "SANSOR-A-1004",
        "timestamp": "2024-05-22T23:30:00.000Z",
        "mode": "NORMAL",
        "temperature": 24.5,
        "humidity": 50.2,
        "pressure": 1013.2,
        "locationLat": 37.5665,
        "locationLng": 126.978,
        "airQuality": 3,
        "createdAt": "2026-03-09T12:52:45.075Z",
        "updatedAt": "2026-03-09T12:52:45.075Z"
      }
    }
  })
  @ApiBody({
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(CreateOneSensorPayloadDto) },
      example: [
        {
          "serial_number": "SANSOR-A-1004",
          "timestamp": "2024-05-23T08:30:00+09:00",
          "mode": "NORMAL",
          "temperature": 24.5,
          "humidity": 50.2,
          "pressure": 1013.2,
          "location": {
            "lat": 37.5665,
            "lng": 126.978
          },
          "air_quality": 42
        },

        {
          "serial_number": "SANSOR-A-1004",
          "timestamp": "2024-05-23T08:40:00+09:00",
          "mode": "NORMAL",
          "temperature": 24.5,
          "humidity": 50.2,
          "pressure": 1013.2,
          "location": {
            "lat": 37.5665,
            "lng": 126.978
          },
          "air_quality": 2
        }
      ]
    }
  })
  async createMany(@Body() dtos: CreateOneSensorPayloadDto[]) {
    try {

      return await this.sensorPayloadService.createMany(dtos);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  @Get('17/find/many/:startDate/:endDate/:sensorStartDate/:sensorEndDate/:skip/:take/:serial_number/:modeSelect/:order/:orderColumn')
  @ApiOperation({
    summary: '수집받은 데이터를 옵션에 따라 조회한다. #17',
    description: '수집받은 데이터를 조건에 따라 조회한다.'
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
    enum: SensorPayloadColumns,
    name: 'orderColumn',
    description: '정렬할 컬럼',
    example: SensorPayloadColumns.id,
    required: true
  })
  @ApiOkResponse({
    description: `정상적으로 응답시 \n
    [
      [
        {
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
            "id": 10,
            "serial_number": "SANSOR-A-1005",
            "timestamp": "2024-05-22T23:40:00.000Z",
            "mode": "NORMAL",
            "temperature": 24.5,
            "humidity": 50.2,
            "pressure": 1013.2,
            "locationLat": 37.5665,
            "locationLng": 126.978,
            "airQuality": 2,
            "createdAt": "2026-03-10T17:17:40.255Z",
            "updatedAt": "2026-03-10T17:17:40.255Z"
          }
        ],
        10
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
  ) {
    try {

      return await this.sensorPayloadService.findManyByOption(startDate, endDate, sensorStartDate, sensorEndDate, skip, take, serial_number, modeSelect);


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }


}
