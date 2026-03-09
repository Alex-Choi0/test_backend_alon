import { InjectRepository } from "@nestjs/typeorm";
import { OrderEnum } from "src/enum";
import { Repository } from "typeorm";
import { SensorPayloadColumns, SensorPayloadEntity } from "../entities/sensor_payload.entity";

export class SensorPayloadRepository {
    constructor(
        @InjectRepository(SensorPayloadEntity)
        private readonly sensorPayloadEntity: Repository<SensorPayloadEntity>
    ) { }

    async createOne(dto: Partial<SensorPayloadEntity>) {
        const record = this.sensorPayloadEntity.create(dto);
        return await this.sensorPayloadEntity.save(record);
    }

    async createMany(dtos: Partial<SensorPayloadEntity>[]) {
        const records = this.sensorPayloadEntity.create(dtos);
        return await this.sensorPayloadEntity.save(records);
    }



    async findMany(serial_number: string, skip: number = 0, take: number = 10, order: OrderEnum = OrderEnum.DESC, orderColumn: SensorPayloadColumns = SensorPayloadColumns.id) {
        const sql = this.sensorPayloadEntity.createQueryBuilder('record')
            .where('record.serial_number = :serial_number', { serial_number })
            .skip(skip)
            .take(take)
            .orderBy(`record.${orderColumn}`, order)

        return await sql.getManyAndCount();
    }
}
