import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SensorService } from 'src/sensor/sensor.service';
import { ServerErrorService } from 'src/server_error/server_error.service';

@Injectable()
export class ScheduleProcessService {
  constructor(
    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService,

    @Inject(SensorService)
    private readonly sensorService: SensorService,
  ) { }

  private errorLocation = 'ScheduleProcessService';

  @Cron('*/5 * * * * *')
  async scheduleActive() {
    try {

      console.log("schedulaActive time : ", new Date());

      // 센서의 Malfunction상태를 확인하고 업데이트
      await this.sensorService.updateSensorMalFunctions();

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }
}
