import { PartialType } from '@nestjs/swagger';
import { CreateOneSensorDto } from './create-one-sensor.dto';

export class UpdateOneSensorDto extends PartialType(CreateOneSensorDto) {}
