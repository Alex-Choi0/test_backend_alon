import { Inject, Injectable } from '@nestjs/common';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { SensorColumns, SensorEntity } from './entities/sensor.entity';
import { SensorRepository } from './repository/sensor.repository';
import { AVAILABLE_SELECT, MODEENUM, MODESELECT, OrderEnum, SENSOR_STATUS_ENUM, SENSOR_STATUS_SELECT } from 'src/enum';
import { TimerService } from 'src/utils/service_timer/timer.service';
import { SensorErrorService } from 'src/sensor_error/sensor_error.service';
import { EmailService } from 'src/utils/service_email/email.service';
import { NoticEmailService } from 'src/notic_email/notic_email.service';

@Injectable()
export class SensorService {
  constructor(
    @Inject(SensorRepository)
    private readonly sensorRepository: SensorRepository,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService,

    @Inject(TimerService)
    private readonly timerService: TimerService,

    @Inject(SensorErrorService)
    private readonly sensorErrorService: SensorErrorService,

    @Inject(EmailService)
    private readonly emailService: EmailService,

    @Inject(NoticEmailService)
    private readonly noticEmailService: NoticEmailService,

  ) { }

  private errorLocation = 'SensorService';

  async createOne(dto: Partial<SensorEntity>) {
    try {


      return await this.sensorRepository.createOne(dto);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  async createMany(dtos: Partial<SensorEntity>[]) {
    try {


      return await this.sensorRepository.createMany(dtos);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }


  async findOneById(id: string) {
    try {

      const record = await this.sensorRepository.findOneById(id);


      return record;

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  async updateOneById(id: string, dto: Partial<SensorEntity>) {
    try {

      return await this.sensorRepository.updateOneById(id, dto);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  async updateSensorMalFunctions(): Promise<undefined | null> {
    try {

      const NORMAL_TIME = Number(process.env.NORMAL_TIME) // 600초는 10분
      const EMERGENCY_TIME = Number(process.env.EMERGENCY_TIME) // 10초


      // sensor에 등록된 records중 status의 값이 NORMAL을 찾는다트
      const records = await this.sensorRepository.findAllByStatus(SENSOR_STATUS_ENUM.NORMAL);


      if (records.length > 0) {
        const malRecords = this.malSensorIds(records, NORMAL_TIME, EMERGENCY_TIME);



        if (malRecords.length > 0) {

          const ids: string[] = [];
          malRecords.map(ele => ele.id).forEach(ele => ids.push(ele));

          const sensorErrorArray = malRecords.map((ele) => {
            return {
              serial_number: ele.id,
              lastPayLoadId: ele.lastSensorPayloadId ? ele.lastSensorPayloadId : undefined,
              lastMode: ele.lastMode ? ele.lastMode : undefined,
              lastTime: ele.lastTime ? ele.lastTime : undefined,
              delay_sec: this.timerService.calculateSecondBetween(ele.updatedAt, new Date()),
            }
          })

          const updateSensorErrorAsy = this.sensorErrorService.create(sensorErrorArray);

          const updateSensorAsy = this.sensorRepository.updateManyByIds(ids, { status: SENSOR_STATUS_ENUM.MALFUNCTION });

          await Promise.all([updateSensorErrorAsy, updateSensorAsy])

          // 알림 유저들한테 이메일 전송
          const malSensorSerial: string[] = sensorErrorArray.map(ele => ele.serial_number);

          // 알림을 받아야 하는 유저 조회
          const noticUsers = await this.noticEmailService.findAllByAvailable(AVAILABLE_SELECT.가능);

          // 실제 보낼 유저가 있을 경우에만 메일을 보낸다. #29
          if (Array.isArray(noticUsers) && noticUsers.length > 0) {
            await this.emailService.sendManyEmails('센서 오작동 발생', `
            오작동 발생 센서 시리얼 번호 : ${malSensorSerial}
            `, noticUsers.map(ele => ele.email));
          }
        }
      }



      return null;

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  malSensorIds(records: SensorEntity[], NORMAL_TIME: number, EMERGENCY_TIME: number): SensorEntity[] {
    // status값이 NORMAL인 중에서  lastMode가 NORMAL인 것을 확인
    const normalRecords = records.filter(ele => {
      if (ele.lastMode && ele.lastMode == MODEENUM.NORMAL) {
        return true;
      }
      return false;
    });
    // 현재시간과 비교해서 10분이 넘은 records를 저장
    const normalMalRecords = normalRecords.filter(ele => {
      if (ele.lastTime) {
        const diff = this.timerService.calculateSecondBetween(new Date(), ele.lastTime);
        console.log("ele lastTime : ", ele.lastTime);
        console.log("ele lastTime : ", diff);

        return diff > NORMAL_TIME;
      };
      return false;
    })



    // status값이 NORMAL인 중에서  lastMode가 EMERGENCY인 것을 확인
    // 현재시간과 비교해서 10초가 넘은 records를 저장
    const emergencyRecords = records.filter(ele => {
      if (ele.lastMode && ele.lastMode == MODEENUM.EMERGENCY) {
        return true;
      }
      return false;
    });

    // 해당 MALFUNCTION 센서에 대해서 sensor_error에 저장
    const emergencyMalRecords = emergencyRecords.filter(ele => {
      if (ele.lastTime && this.timerService.calculateSecondBetween(new Date(), ele.lastTime) > EMERGENCY_TIME) {
        return true;
      };
      return false;
    })

    return [...normalMalRecords, ...emergencyMalRecords];



  }

  async findAllByIds(ids: string[]) {
    try {

      if (Array.isArray(ids) && ids.length > 0) {

        if (ids.length == 1) {
          return [await this.findOneById(ids[0])];
        } else {
          return await this.sensorRepository.findAllByIds(ids);
        }

      }

      return [];

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  async notFoundByIds(ids: string[]) {
    try {

      if (Array.isArray(ids) && ids.length > 0) {

        if (ids.length == 1) {
          const result = [await this.findOneById(ids[0])];
          if (result.length <= 0) return [ids[0]];
        } else {
          const result = await this.sensorRepository.findAllByIds(ids);
          return ids.filter((ele) => {
            let bool: boolean = false;
            for (let i = 0; i < result.length; i++) {
              if (ele == result[i].id) {
                bool = true;
                break;
              }
            }

            if (!bool) return true;
            return false;

          })
        }

      }

      return [];

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  async findManyByOptions(
    id: string,
    name: string,
    model: string,
    manufacturer: string,
    startDate: string,
    endDate: string,
    sensorStartDate: string,
    sensorEndDate: string,
    skip: number,
    take: number,
    lastModeSelect: MODESELECT = MODESELECT.전체,
    statusSelect: SENSOR_STATUS_SELECT = SENSOR_STATUS_SELECT.전체,
    order: OrderEnum = OrderEnum.DESC,
    orderColumn: SensorColumns = SensorColumns.id
  ) {
    try {

      return await this.sensorRepository.findManyByOption(id, name, model, manufacturer, startDate, endDate, sensorStartDate, sensorEndDate, skip, take, lastModeSelect, statusSelect, order, orderColumn);


    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  async getTotalStatus() {
    try {

      return await this.sensorRepository.getTotalStatus();

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }
}
