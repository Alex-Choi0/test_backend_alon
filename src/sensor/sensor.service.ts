import { Inject, Injectable } from '@nestjs/common';
import { SensorRepository } from './repository/sensor.repository';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { SensorEntity } from './entities/sensor.entity';

@Injectable()
export class SensorService {
  constructor(
    @Inject(SensorRepository)
    private readonly sensorRepository : SensorRepository,

    @Inject(ServerErrorService)
    private readonly serverErrorService : ServerErrorService
  ){}

  private errorLocation = 'SensorService';

  async createOne(dto : Partial<SensorEntity>){
    try{


      return await this.sensorRepository.createOne(dto);

    } catch(err){
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }
}
