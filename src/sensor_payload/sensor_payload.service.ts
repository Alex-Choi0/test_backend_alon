import { Inject, Injectable } from '@nestjs/common';
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
    private readonly timerService: TimerService
  ) { }

  private errorLocation = 'SensorPayloadService';

  async createOne(dto: CreateOneSensorPayloadDto) {
    try {

      const record = this.createRecord(dto);



      return await this.sensorPayloadRepository.createOne(record)

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


