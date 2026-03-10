import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOneSensorDto } from './dto/create-one-sensor.dto';
import { MODESELECT, OrderEnum, SENSOR_STATUS_SELECT } from 'src/enum';
import { SensorPayloadColumns } from 'src/sensor_payload/entities/sensor_payload.entity';
import { SensorColumns, SensorEntity } from './entities/sensor.entity';

@ApiTags('센서를 증록하고 조회하는 API')
@Controller('sensor')
export class SensorController {
  constructor(
    @Inject(SensorService)
    private readonly sensorService: SensorService,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService
  ) { }

  private errorLocation = 'SensorController'

  @Post('3/create/one')
  @ApiOperation({
    summary: '하나의 시리얼 번호를 갖고있는 센서를 생성한다. #3',
    description: '수신받을 센서 하나를 생성한다.'
  })
  async createOne(@Body() dto: CreateOneSensorDto) {
    try {

      return await this.sensorService.createOne(dto);

    } catch (err) {
      console.log("createOne err : ", err);
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  @Get('9/find/one/:id')
  @ApiOperation({
    summary: '시리얼번호(ID)를 이용해서 하나의 센서를 조회한다. #9',
    description: '하나의 센서를 조회한다.'
  })
  @ApiParam({
    name: 'id',
    description: '조회할 센서의 시리얼번호(ID)',
    example: 'SANSOR-A-1004',
    required: true
  })
  async findOneById(@Param('id') id: string) {
    try {
      return await this.sensorService.findOneById(id);
    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  @Get('11/update/malfunction')
  @ApiOperation({
    summary: '[테스트용 API] 센서의 오작동 여부를 확인후 업데이트한다. #11',
  })
  async updateMalfunctionSensor() {
    try {

      return await this.sensorService.updateSensorMalFunctions();


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  @Get('18/find/many/:startDate/:endDate/:sensorStartDate/:sensorEndDate/:skip/:take/:id/:name/:model/:manufacturer/:lastModeSelect/:statusSelect/:order/:orderColumn')
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
    description: '센서가 서버로 요청한 시작시간을 입력. 없을시 "-"입력. sensorStartDate 또는 sensorEndDate값이 "-"일 경우 센서 수집기간을 포함해서 조회하지 않는다.',
    type: String,
    example: '2024-05-22T08:30:00+09:00',
    required: true
  })
  @ApiParam({
    name: 'sensorEndDate',
    description: '센서 서버로 요청한 끝나는 시간을 입력. 없을시 "-"입력. sensorStartDate 또는 sensorEndDate값이 "-"일 경우 센서 수집기간을 포함해서 조회하지 않는다.',
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
    name: 'id',
    description: '조회할 시리얼 번호. "-" 입력시 시리얼 번호와 관계없이 조회',
    example: 'SANSOR-A-1005',
    required: true
  })
  @ApiParam({
    type: String,
    name: 'name',
    description: '센서 이름. "-" 입력시 이름과 관계없이 조회',
    example: 'Temperature Sensor',
    required: true
  })
  @ApiParam({
    type: String,
    name: 'model',
    description: '센서 모델. "-" 입력시 모델과 관계없이 조회',
    example: 'TS-100',
    required: true
  })
  @ApiParam({
    type: String,
    name: 'manufacturer',
    description: '센서 제조사. "-" 입력시 제조사와 관계없이 조회',
    example: 'Samsung',
    required: true
  })
  @ApiParam({
    enum: MODESELECT,
    name: 'lastModeSelect',
    description: '조회할 모드. 전체로 선택하면 모드 상관없이 전체를 조회한다.',
    example: MODESELECT.전체,
    required: true
  })
  @ApiParam({
    enum: SENSOR_STATUS_SELECT,
    name: 'statusSelect',
    description: '조회할 센서 상태. 전체로 선택하면 모드 상관없이 전체를 조회한다.',
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
    example: SensorColumns.id,
    required: true
  })
  @ApiOkResponse({
    description: `정상적으로 응답시 \n
    [
      [
        {
          "id": 센서 수집 ID,
          "id": 센서 시리얼 번호,
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
            "id": "SANSOR-A-1005",
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
    @Param('id') id: string,
    @Param('name') name: string,
    @Param('model') model: string,
    @Param('manufacturer') manufacturer: string,
    @Param('lastModeSelect') lastModeSelect: MODESELECT,
    @Param('statusSelect') statusSelect: SENSOR_STATUS_SELECT,
    @Param('order') order: OrderEnum,
    @Param('orderColumn') orderColumn: SensorColumns,
  ) {
    try {

      return await this.sensorService.findManyByOptions(
        id,
        name,
        model,
        manufacturer,
        startDate,
        endDate,
        sensorStartDate,
        sensorEndDate,
        skip,
        take,
        lastModeSelect,
        statusSelect,
        order,
        orderColumn
      );


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

}
