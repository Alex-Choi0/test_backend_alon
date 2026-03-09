import { InjectRepository } from "@nestjs/typeorm";
import { SensorPayloadColumns, SensorPayloadEntity } from "../entities/sensor_payload.entity";
import { Repository } from "typeorm";
import { OrderEnum } from "src/enum";

export class SensorPayloadRepository {
    constructor(
        @InjectRepository(SensorPayloadEntity)
        private readonly sensorPayloadEntity : Repository<SensorPayloadEntity>
    ){}

    async createOne(dto : Partial<SensorPayloadEntity>){
        const record = this.sensorPayloadEntity.create(dto);
        return await this.sensorPayloadEntity.save(record);
    }

    async findMany(serial_number : string, skip : number = 0, take : number = 10, order : OrderEnum = OrderEnum.DESC, orderColumn : SensorPayloadColumns = SensorPayloadColumns.id){
        const sql = this.sensorPayloadEntity.createQueryBuilder('record')
        .where('record.serial_number = :serial_number', {serial_number})
        .skip(skip)
        .take(take)
        .orderBy(`record.${orderColumn}`, order)

        return await sql.getManyAndCount();
    }
}