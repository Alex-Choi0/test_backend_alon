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
import { SensorErrorModule } from './sensor_error/sensor_error.module';
import { NoticEmailModule } from './notic_email/notic_email.module';
import { EmailModule } from './utils/service_email/email.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // env파일 스키마 점검
      validationSchema: Joi.object({
        BACKEND_SETTING: Joi.string().default('테스트'),
        NORMAL_TIME: Joi.number().default(600), // 센서 모드가 NORMAL일 경우 default는 600초후 데이터가 안오면 MALFUNCTION이다.
        EMERGENCY_TIME: Joi.number().default(10), // 센서 모드가 EMERGENCY일 경우 default는 10초후 데이터가 안오면 MALFUNCTION이다.
        DB_HOST: Joi.string().required(), // DB접속에 필요한 호스트
        DB_USERNAME: Joi.string().required(), // DB접속에 사용되는 유저
        DB_PASSWORD: Joi.string().required(), // DB접속에 필요한 비밀번호. (DB_USERNAME에 대응)
        DB_DATABASE: Joi.string().required(), // 접속할 데이터베이스 이름
        DB_SYNCHRONIZE: Joi.string().default('false'), // 실시간 데이터베이스 업데이트 유무. true이면 코드의 Entity변화에 따라 테이블이 업데이트(테스트용). 기본은 false
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
    ScheduleProcessModule,
    SensorErrorModule,
    NoticEmailModule,
    EmailModule,
    StatisticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
