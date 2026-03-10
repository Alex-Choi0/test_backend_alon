import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SensorErrorService } from './sensor_error.service';

@Controller('sensor-error')
export class SensorErrorController {
  constructor(private readonly sensorErrorService: SensorErrorService) { }

}
