import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOneSensorDto } from './dto/create-one-sensor.dto';

@ApiTags('센서를 증록하고 조회하는 API')
@Controller('sensor')
export class SensorController {
  constructor(
    @Inject(SensorService)
    private readonly sensorService: SensorService,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService
  ) { }

  private errorLocation = 'SensorController'

  @Post('3/create/one')
  @ApiOperation({
    summary: '하나의 시리얼 번호를 갖고있는 센서를 생성한다. #3',
    description: '수신받을 센서 하나를 생성한다.'
  })
  async createOne(@Body() dto: CreateOneSensorDto) {
    try {

      return await this.sensorService.createOne(dto);

    } catch (err) {
      console.log("createOne err : ", err);
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  @Get('9/find/one/:id')
  @ApiOperation({
    summary: '시리얼번호(ID)를 이용해서 하나의 센서를 조회한다. #9',
    description: '하나의 센서를 조회한다.'
  })
  @ApiParam({
    name: 'id',
    description: '조회할 센서의 시리얼번호(ID)',
    example: 'SANSOR-A-1004',
    required: true
  })
  async findOneById(@Param('id') id: string) {
    try {
      return await this.sensorService.findOneById(id);
    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  @Get('11/update/malfunction')
  @ApiOperation({
    summary: '[테스트용 API] 센서의 오작동 여부를 확인후 업데이트한다. #11',
  })
  async updateMalfunctionSensor() {
    try {

      return await this.sensorService.updateSensorMalFunctions();


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

}
