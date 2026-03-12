import { Inject, Injectable } from '@nestjs/common';
import { MODESELECT } from 'src/enum';
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

  // 등록된 센서의 전체 상태를 확인한다.
  async getTotalSensorStatus() {
    try {

      return await this.sensorService.getTotalStatus();


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  // 센서에서 수집된 데이터의 평균과 중앙값을 확인한다.
  async getSensorDataAvgMidData(
    sensorStartDate: string,
    sensorEndDate: string,
    serial_numbers: string[] = [],
    modeSelect: MODESELECT = MODESELECT.전체
  ) {
    try {

      return await this.sensorPayloadService.getAvgMidData(sensorStartDate, sensorEndDate, serial_numbers, modeSelect)

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  // 오작동된 센서에서 수집된 데이터의 평균과 중앙값을 확인한다.
  async getSensorErrorDataAvgMidData(
    startDate: string,
    endDate: string,
    serial_numbers: string[] = [],
    modeSelect: MODESELECT = MODESELECT.전체
  ) {
    try {

      return await this.sensorErrorService.getAvgMidErrorData(startDate, endDate, serial_numbers, modeSelect);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }


}
