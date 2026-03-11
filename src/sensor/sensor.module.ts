import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerErrorModule } from 'src/server_error/server_error.module';
import { TimerModule } from 'src/utils/service_timer/timer.module';
import { SensorEntity } from './entities/sensor.entity';
import { SensorRepository } from './repository/sensor.repository';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { SensorErrorModule } from 'src/sensor_error/sensor_error.module';
import { EmailModule } from 'src/utils/service_email/email.module';
import { NoticEmailModule } from 'src/notic_email/notic_email.module';

@Module({
  imports: [TypeOrmModule.forFeature([SensorEntity]), ServerErrorModule, TimerModule, SensorErrorModule, EmailModule, NoticEmailModule],
  controllers: [SensorController],
  providers: [SensorService, SensorRepository],
  exports: [SensorService]
})
export class SensorModule { }
