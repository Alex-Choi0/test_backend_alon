import { Inject, Injectable } from '@nestjs/common';
import { MODESELECT, SENSOR_STATUS_ENUM } from 'src/enum';
import { SensorService } from 'src/sensor/sensor.service';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { TimerService } from 'src/utils/service_timer/timer.service';
import { CreateOneSensorPayloadDto } from './dto/create-one-sensor_payload.dto';
import { SensorPayloadRepository } from './repository/sensor_payload.repository';

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
      const existSensor = await this.sensorService.findOneById(dto.serial_number);
      const saveRecord = await this.sensorPayloadRepository.createOne(record)

      if (!existSensor) {
        const createRecord = await this.sensorService.createOne({
          id: saveRecord.serial_number,
          lastMode: saveRecord.mode,
          status: SENSOR_STATUS_ENUM.NORMAL,
          lastTime: saveRecord.createdAt,
          lastSensorPayloadId: saveRecord.id,
        })
      } else {
        const updateRecord = await this.sensorService.updateOneById(saveRecord.serial_number, {
          lastMode: saveRecord.mode,
          status: SENSOR_STATUS_ENUM.NORMAL,
          lastTime: saveRecord.createdAt,
          lastSensorPayloadId: saveRecord.id,
        })
      }


      return saveRecord

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  async createMany(dtos: CreateOneSensorPayloadDto[]) {
    try {

      const sensorIds: string[] = [...new Set(dtos.map(ele => ele.serial_number))]
      console.log('SensorPayloadService createMAny sensorIds : ', sensorIds)
      if (sensorIds.length > 1) throw new Error('동일한 시리얼 데이터를 전송해야 합니다.')

      const existSensor = await this.sensorService.findOneById(sensorIds[0]);

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

      if (!existSensor) {
        // 등록되지 않은 시리얼 번호 확인
        const createRecord = await this.sensorService.createOne({
          id: saveRecords[lastIndex].serial_number,
          lastMode: saveRecords[lastIndex].mode,
          status: SENSOR_STATUS_ENUM.NORMAL,
          lastTime: saveRecords[lastIndex].createdAt,
          lastSensorPayloadId: saveRecords[lastIndex].id,
        })

      } else {
        const updateRecord = await this.sensorService.updateOneById(saveRecords[0].serial_number, {
          lastMode: saveRecords[lastIndex].mode,
          status: SENSOR_STATUS_ENUM.NORMAL,
          lastTime: saveRecords[lastIndex].createdAt,
          lastSensorPayloadId: saveRecords[lastIndex].id,
        })
      }

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

  async findManyByOption(startDate: string, endDate: string, sensorStartDate: string, sensorEndDate: string, skip: number, take: number, serial_numbers: string[], mode: MODESELECT = MODESELECT.전체) {
    try {

      // startDate, endDate, sensorStartDate, sensorEndDate 검증 및 UTC시간으로 변환
      startDate = startDate == '-' ? startDate : this.timerService.changeToUTC(startDate);
      endDate = endDate == '-' ? endDate : this.timerService.changeToUTC(endDate);
      sensorStartDate = sensorStartDate == '-' ? sensorStartDate : this.timerService.changeToUTC(sensorStartDate);
      sensorEndDate = sensorEndDate == '-' ? sensorEndDate : this.timerService.changeToUTC(sensorEndDate);

      return await this.sensorPayloadRepository.findManyByOptions(startDate, endDate, sensorStartDate, sensorEndDate, skip, take, serial_numbers, mode);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  async getAvgMidData(
    sensorStartDate: string,
    sensorEndDate: string,
    serial_numbers: string[] = [],
    modeSelect: MODESELECT = MODESELECT.전체
  ) {
    try {

      sensorStartDate = sensorStartDate == '-' ? sensorStartDate : this.timerService.changeToUTC(sensorStartDate);
      sensorEndDate = sensorEndDate == '-' ? sensorEndDate : this.timerService.changeToUTC(sensorEndDate);

      return await this.sensorPayloadRepository.getAvgMidData(sensorStartDate, sensorEndDate, serial_numbers, modeSelect);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }
}


