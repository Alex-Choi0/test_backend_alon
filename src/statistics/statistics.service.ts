import { Inject, Injectable } from '@nestjs/common';
import { DATE_TYPE } from 'src/enum';
import { SensorService } from 'src/sensor/sensor.service';
import { SensorErrorService } from 'src/sensor_error/sensor_error.service';
import { SensorPayloadService } from 'src/sensor_payload/sensor_payload.service';
import { ServerErrorService } from 'src/server_error/server_error.service';

@Injectable()
export class StatisticsService {
  constructor(
    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService,

    @Inject(SensorService)
    private readonly sensorService: SensorService,

    @Inject(SensorErrorService)
    private readonly sensorErrorService: SensorErrorService,

    @Inject(SensorPayloadService)
    private readonly sensorPayloadService: SensorPayloadService
  ) { }

  private errorLocation = 'StatisticsService';

  // 등록된 센서의 상태를 일/월/년별로 응답
  async getTotalSensorStatus() {
    try {

      return await this.sensorService.getTotalStatus();


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

}
