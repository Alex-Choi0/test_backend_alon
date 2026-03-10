import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SensorErrorService } from './sensor_error.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('센서의 오작동 로그를 기록 조회하는 API')
@Controller('sensor-error')
export class SensorErrorController {
  constructor(private readonly sensorErrorService: SensorErrorService) { }

}
