import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOneSensorDto } from './dto/create-one-sensor.dto';

@Controller('sensor')
export class SensorController {
  constructor(
    @Inject(SensorService)
    private readonly sensorService: SensorService,

    @Inject(ServerErrorService)
    private readonly serverErrorService : ServerErrorService
  ) {}

  private errorLocation = 'SensorController'

  @Post('3/create/one')
  @ApiOperation({
    summary : '하나의 시리얼 번호를 갖고있는 센서를 생성한다. #3',
    description : '수신받을 센서 하나를 생성한다.'
  })
  async createOne(@Body() dto : CreateOneSensorDto){
    try{

      return await this.sensorService.createOne(dto);

    } catch(err){
      console.log("createOne err : ", err);
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  
}
