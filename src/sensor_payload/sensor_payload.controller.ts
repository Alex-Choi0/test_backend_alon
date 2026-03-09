import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { CreateOneSensorPayloadDto } from './dto/create-one-sensor_payload.dto';
import { SensorPayloadService } from './sensor_payload.service';

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
    description: '하나의 센서가 단일 데이터를 전송한다.'
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


}
