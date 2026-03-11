import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { ServerErrorModule } from 'src/server_error/server_error.module';
import { SensorModule } from 'src/sensor/sensor.module';
import { SensorErrorModule } from 'src/sensor_error/sensor_error.module';
import { SensorPayloadModule } from 'src/sensor_payload/sensor_payload.module';

@Module({
  imports: [ServerErrorModule, SensorModule, SensorErrorModule, SensorPayloadModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule { }
