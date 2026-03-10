import { Inject, Injectable } from '@nestjs/common';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { SensorErrorRepository } from './repository/sensor_error.repository';
import { SensorErrorEntity } from './entities/sensor_error.entity';

@Injectable()
export class SensorErrorService {
  constructor(
    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService,

    @Inject(SensorErrorRepository)
    private readonly sensorErrorRepository: SensorErrorRepository,

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

}
