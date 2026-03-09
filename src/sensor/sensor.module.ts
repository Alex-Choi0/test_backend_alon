import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { ServerErrorModule } from 'src/server_error/server_error.module';
import { SensorRepository } from './repository/sensor.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorEntity } from './entities/sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SensorEntity]), ServerErrorModule],
  controllers: [SensorController],
  providers: [SensorService, SensorRepository],
  exports : [SensorService]
})
export class SensorModule {}
