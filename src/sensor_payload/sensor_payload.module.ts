import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerErrorModule } from 'src/server_error/server_error.module';
import { TimerModule } from 'src/utils/service_timer/timer.module';
import { SensorPayloadEntity } from './entities/sensor_payload.entity';
import { SensorPayloadRepository } from './repository/sensor_payload.repository';
import { SensorPayloadController } from './sensor_payload.controller';
import { SensorPayloadService } from './sensor_payload.service';
import { SensorModule } from 'src/sensor/sensor.module';

@Module({
  imports: [TypeOrmModule.forFeature([SensorPayloadEntity]), ServerErrorModule, TimerModule, SensorModule],
  controllers: [SensorPayloadController],
  providers: [SensorPayloadService, SensorPayloadRepository],
  exports: [SensorPayloadService]
})
export class SensorPayloadModule { }
