import { InjectRepository } from "@nestjs/typeorm";
import { SensorErrorEntity } from "../entities/sensor_error.entity";
import { Repository } from "typeorm";

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

}
