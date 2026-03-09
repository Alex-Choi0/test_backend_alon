import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerErrorModule } from './server_error/server_error.module';
import { SensorModule } from './sensor/sensor.module';
import { SensorPayloadModule } from './sensor_payload/sensor_payload.module';
import { ScheduleProcessModule } from './schedule_process/schedule_process.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // env파일 스키마 점검
      validationSchema: Joi.object({
        BACKEND_SETTING: Joi.string().default('테스트')
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE == 'true',
    }),
    ServerErrorModule,
    SensorModule,
    SensorPayloadModule,
    ScheduleProcessModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
