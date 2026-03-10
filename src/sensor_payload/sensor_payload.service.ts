import { Inject, Injectable } from '@nestjs/common';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { TimerService } from 'src/utils/service_timer/timer.service';
import { CreateOneSensorPayloadDto } from './dto/create-one-sensor_payload.dto';
import { SensorPayloadRepository } from './repository/sensor_payload.repository';
import { SensorService } from 'src/sensor/sensor.service';

@Injectable()
export class SensorPayloadService {
  constructor(
    @Inject(SensorPayloadRepository)
    private readonly sensorPayloadRepository: SensorPayloadRepository,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService,

    @Inject(TimerService)
    private readonly timerService: TimerService,

    @Inject(SensorService)
    private readonly sensorService: SensorService
  ) { }

  private errorLocation = 'SensorPayloadService';

  async createOne(dto: CreateOneSensorPayloadDto) {
    try {

      const record = this.createRecord(dto);
      // sensor record를 수정


      const saveRecord = await this.sensorPayloadRepository.createOne(record)
      const updateRecord = await this.sensorService.updateOneById(saveRecord.serial_number, {
        lastMode: saveRecord.mode,
        lastTime: saveRecord.createdAt,
        lastSensorPayloadId: saveRecord.id,
      })

      console.log("SensorPayloadService createOne updateRecord : ", updateRecord);

      return saveRecord

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  async createMany(dtos: CreateOneSensorPayloadDto[]) {
    try {

      let records = dtos.map(ele => this.createRecord(ele));
      const lastIndex: number = records.length - 1;

      console.log("SensorPayloadService createMany lastIndex : ", lastIndex);

      // timestamp기준으로 정렬
      records = records.sort((a, b) => {
        if (a.timestamp > b.timestamp) return 1;
        else return -1
      })

      console.log("SensorPayloadService createMany records : ", records);


      const saveRecords = await this.sensorPayloadRepository.createMany(records)

      const updateRecord = await this.sensorService.updateOneById(saveRecords[0].serial_number, {
        lastMode: saveRecords[lastIndex].mode,
        lastTime: saveRecords[lastIndex].createdAt,
        lastSensorPayloadId: saveRecords[lastIndex].id,
      })

      console.log("SensorPayloadService createOne createMany : ", updateRecord);

      return saveRecords;


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }


  createRecord(dto: CreateOneSensorPayloadDto) {

    const airQuality = dto.air_quality;
    let locationLat = -1;
    let locationLng = -1;
    let timestamp: Date = new Date(this.timerService.changeToUTC(dto.timestamp))

    if (dto.location) {
      locationLat = Number(dto.location.lat);
      locationLng = Number(dto.location.lng);
    }

    return { ...dto, timestamp, locationLat, locationLng, airQuality };
  }
}


