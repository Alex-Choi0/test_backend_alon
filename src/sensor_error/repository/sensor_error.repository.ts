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

}
