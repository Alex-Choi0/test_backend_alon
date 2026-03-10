import { Module } from '@nestjs/common';
import { SensorErrorService } from './sensor_error.service';
import { SensorErrorController } from './sensor_error.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorErrorEntity } from './entities/sensor_error.entity';
import { SensorErrorRepository } from './repository/sensor_error.repository';
import { ServerErrorModule } from 'src/server_error/server_error.module';

@Module({
  imports: [ServerErrorModule, TypeOrmModule.forFeature([SensorErrorEntity])],
  controllers: [SensorErrorController],
  providers: [SensorErrorService, SensorErrorRepository],
  exports: [SensorErrorService]
})
export class SensorErrorModule { }
