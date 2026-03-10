import { Inject, Injectable } from '@nestjs/common';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { SensorEntity } from './entities/sensor.entity';
import { SensorRepository } from './repository/sensor.repository';
import { MODEENUM, SENSOR_STATUS_ENUM } from 'src/enum';
import { TimerService } from 'src/utils/service_timer/timer.service';
import { SensorErrorService } from 'src/sensor_error/sensor_error.service';

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

  ) { }

  private errorLocation = 'SensorService';

  async createOne(dto: Partial<SensorEntity>) {
    try {


      return await this.sensorRepository.createOne(dto);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  async findOneById(id: string) {
    try {

      const record = await this.sensorRepository.findOneById(id);

      if (!record) {
        throw new Error('존재하지 않는 시리얼번호 입니다.');
      }

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


          const updateSensorErrorAsy = this.sensorErrorService.create(malRecords.map((ele) => {
            return {
              serial_number: ele.id,
              lastPayLoadId: ele.lastSensorPayloadId ? ele.lastSensorPayloadId : undefined,
              lastMode: ele.lastMode ? ele.lastMode : undefined,
              lastTime: ele.lastTime ? ele.lastTime : undefined
            }
          }))

          const updateSensorAsy = this.sensorRepository.updateManyByIds(ids, { status: SENSOR_STATUS_ENUM.MALFUNCTION });

          await Promise.all([updateSensorErrorAsy, updateSensorAsy])


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
}
