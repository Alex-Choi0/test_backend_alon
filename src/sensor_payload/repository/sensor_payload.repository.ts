import { InjectRepository } from "@nestjs/typeorm";
import { MODEENUM, MODESELECT, OrderEnum } from "src/enum";
import { Or, Repository } from "typeorm";
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

    async findManyByOptions(startDate: string, endDate: string, sensorStartDate: string, sensorEndDate: string, skip: number, take: number, serial_numbers: string[], mode: MODESELECT = MODESELECT.전체, order: OrderEnum = OrderEnum.DESC, orderColumn: SensorPayloadColumns = SensorPayloadColumns.id) {
        const sql = this.sensorPayloadEntity.createQueryBuilder('record')
            .where('1=1')
            .skip(skip)
            .take(take)
            .orderBy(`record.${orderColumn}`, order);

        if (serial_numbers.length > 0) {
            console.log("SensorPayloadRepository findManyByOptions serial_numbers : ", serial_numbers);
            if (serial_numbers.length == 1) {
                sql.andWhere('record.serial_number = :serial_numbers', { serial_numbers: serial_numbers[0] });
            } else {
                sql.andWhere('record.serial_number IN(:...serial_numbers)', { serial_numbers });
            }
        }

        if (startDate != '-' && endDate != '-') {
            sql.andWhere('record.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
        }

        if (sensorStartDate != '-' && sensorEndDate != '-') {
            sql.andWhere('record.timestamp BETWEEN :sensorStartDate AND :sensorEndDate', { sensorStartDate, sensorEndDate });
        }

        if (mode != MODESELECT.전체) {
            console.log("SensorPayloadRepository findManyByOptions mode : ", mode);
            sql.andWhere('record.mode = :mode', { mode })
        }

        return await sql.getManyAndCount();

    }
}
