import { PartialType } from '@nestjs/swagger';
import { CreateOneSensorPayloadDto } from './create-one-sensor_payload.dto';

export class UpdateOneSensorPayloadDto extends PartialType(CreateOneSensorPayloadDto) {}
