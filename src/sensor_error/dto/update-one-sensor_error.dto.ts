import { PartialType } from '@nestjs/swagger';
import { CreateOneSensorErrorDto } from './create-one-sensor_error.dto';

export class UpdateOneSensorErrorDto extends PartialType(CreateOneSensorErrorDto) { }
