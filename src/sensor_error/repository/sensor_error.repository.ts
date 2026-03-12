import { InjectRepository } from "@nestjs/typeorm";
import { SensorErrorColumns, SensorErrorEntity } from "../entities/sensor_error.entity";
import { Repository } from "typeorm";
import { MODESELECT, OrderEnum } from "src/enum";
import { SensorErrorController } from "../sensor_error.controller";

export class SensorErrorRepository {
  constructor(
    @InjectRepository(SensorErrorEntity)
    private readonly sensorErrorEntity: Repository<SensorErrorEntity>
  ) { }

  async createOne(dto: Partial<SensorErrorEntity>) {
    const record = this.sensorErrorEntity.create(dto);
    return await this.sensorErrorEntity.save(record);
  }

  async createMany(dtos: Partial<SensorErrorEntity>[]) {
    const records = this.sensorErrorEntity.create(dtos);
    return await this.sensorErrorEntity.save(records);
  }

  async findManyByOptions(
    serial_number: string,
    startDate: string,
    endDate: string,
    sensorStartDate: string,
    sensorEndDate: string,
    skip: number,
    take: number,
    lastModeSelect: MODESELECT = MODESELECT.전체,
    order: OrderEnum = OrderEnum.DESC,
    orderColumn: SensorErrorColumns = SensorErrorColumns.id
  ) {

    const sql = this.sensorErrorEntity.createQueryBuilder('record')
      .where('1 = 1')
      .leftJoinAndSelect('record.lastPayload', 'payload')
      .skip(skip)
      .take(take)
      .orderBy(`record.${orderColumn}`, order);

    if (serial_number != '-') {
      sql.andWhere('record.serial_number = :serial_number', { serial_number });
    }

    if (startDate != '-' && endDate != '-') {
      sql.andWhere('record.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    if (sensorStartDate != '-' && sensorEndDate != '-') {
      sql.andWhere('record.lastTime BETWEEN :sensorStartDate AND :sensorEndDate', { sensorStartDate, sensorEndDate });
    }

    if (lastModeSelect != MODESELECT.전체) {
      sql.andWhere('record.lastMode = :lastMode', { lastMode: lastModeSelect })
    }

    return await sql.getManyAndCount();

  }

  async getAvgMidErrorData(
    startDate: string,
    endDate: string,
    serial_numbers: string[] = [],
    modeSelect: MODESELECT = MODESELECT.전체
  ): Promise<{ [key: string]: { avg: number, median: number } }> {

    const sql = this.sensorErrorEntity
      .createQueryBuilder('error')
      .leftJoin('error.lastPayload', 'payload')
      .select([
        `AVG(payload.temperature)::float as temperature_avg`,
        `AVG(payload.humidity)::float as humidity_avg`,
        `AVG(payload.pressure)::float as pressure_avg`,
        `AVG(payload."airQuality")::float as air_quality_avg`,
        `AVG(error.delay_sec)::float as delay_avg`,

        `percentile_cont(0.5) WITHIN GROUP (ORDER BY payload.temperature) as temperature_median`,
        `percentile_cont(0.5) WITHIN GROUP (ORDER BY payload.humidity) as humidity_median`,
        `percentile_cont(0.5) WITHIN GROUP (ORDER BY payload.pressure) as pressure_median`,
        `percentile_cont(0.5) WITHIN GROUP (ORDER BY payload."airQuality") as air_quality_median`,
        `percentile_cont(0.5) WITHIN GROUP (ORDER BY error.delay_sec) as delay_median`
      ])
      .where('1=1');

    if (serial_numbers.length > 0) {
      if (serial_numbers.length === 1) {
        sql.andWhere('error.serial_number = :serial_number', {
          serial_number: serial_numbers[0]
        });
      } else {
        sql.andWhere('error.serial_number IN(:...serial_numbers)', {
          serial_numbers
        });
      }
    }

    if (startDate !== '-' && endDate !== '-') {
      // lastTime은 서버에서 수신받은 시간이다.
      sql.andWhere(
        'error.lastTime BETWEEN :startDate AND :endDate',
        { startDate, endDate }
      );
    }

    if (modeSelect !== MODESELECT.전체) {
      sql.andWhere('error.lastMode = :mode', { mode: modeSelect });
    }

    const result = await sql.getRawOne();

    return {
      temperature: {
        avg: Number(result.temperature_avg),
        median: Number(result.temperature_median)
      },
      humidity: {
        avg: Number(result.humidity_avg),
        median: Number(result.humidity_median)
      },
      pressure: {
        avg: Number(result.pressure_avg),
        median: Number(result.pressure_median)
      },
      airQuality: {
        avg: Number(result.air_quality_avg),
        median: Number(result.air_quality_median)
      },
      delay_sec: {
        avg: Number(result.delay_avg),
        median: Number(result.delay_median)
      }
    };
  }

}
