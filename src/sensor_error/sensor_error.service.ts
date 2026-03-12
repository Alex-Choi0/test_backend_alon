import { Inject, Injectable } from '@nestjs/common';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { SensorErrorRepository } from './repository/sensor_error.repository';
import { SensorErrorColumns, SensorErrorEntity } from './entities/sensor_error.entity';
import { MODESELECT, OrderEnum } from 'src/enum';
import { TimerService } from 'src/utils/service_timer/timer.service';

@Injectable()
export class SensorErrorService {
  constructor(
    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService,

    @Inject(SensorErrorRepository)
    private readonly sensorErrorRepository: SensorErrorRepository,

    @Inject(TimerService)
    private readonly timerService: TimerService

  ) { }

  private errorLocation = 'SensorErrorService';

  async create(dtos: Partial<SensorErrorEntity>[]) {
    try {

      if (Array.isArray(dtos) && dtos.length > 0) {
        if (dtos.length == 1) {
          return await this.sensorErrorRepository.createOne(dtos[0]);
        } else {
          return await this.sensorErrorRepository.createMany(dtos);
        }
      }

      return null;

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  async findManyByOptions(
    serial_number: string,
    startDate: string,
    endDate: string,
    sensorStartDate: string,
    sensorEndDate: string,
    skip: number,
    take: number,
    lastModeSelect: MODESELECT = MODESELECT.전체,
    order: OrderEnum = OrderEnum.DESC,
    orderColumn: SensorErrorColumns = SensorErrorColumns.id
  ) {
    try {

      // startDate, endDate, sensorStartDate, sensorEndDate 검증 및 UTC시간으로 변환
      startDate = startDate == '-' ? startDate : this.timerService.changeToUTC(startDate);
      endDate = endDate == '-' ? endDate : this.timerService.changeToUTC(endDate);
      sensorStartDate = sensorStartDate == '-' ? sensorStartDate : this.timerService.changeToUTC(sensorStartDate);
      sensorEndDate = sensorEndDate == '-' ? sensorEndDate : this.timerService.changeToUTC(sensorEndDate);

      return await this.sensorErrorRepository.findManyByOptions(
        serial_number,
        startDate,
        endDate,
        sensorStartDate,
        sensorEndDate,
        skip,
        take,
        lastModeSelect,
        order,
        orderColumn
      )

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  async getAvgMidErrorData(
    startDate: string,
    endDate: string,
    serial_numbers: string[] = [],
    modeSelect: MODESELECT = MODESELECT.전체
  ) {
    try {

      startDate = startDate == '-' ? startDate : this.timerService.changeToUTC(startDate);
      endDate = endDate == '-' ? endDate : this.timerService.changeToUTC(endDate);

      return await this.sensorErrorRepository.getAvgMidErrorData(startDate, endDate, serial_numbers, modeSelect);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

}
