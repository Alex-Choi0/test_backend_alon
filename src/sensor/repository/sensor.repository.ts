import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SensorColumns, SensorEntity } from "../entities/sensor.entity";
import { Repository } from "typeorm";
import { MODESELECT, OrderEnum, SENSOR_STATUS_ENUM, SENSOR_STATUS_SELECT } from "src/enum";

@Injectable()
export class SensorRepository {
    constructor(
        @InjectRepository(SensorEntity)
        private readonly sensorEntity: Repository<SensorEntity>
    ) { }

    async createOne(dto: Partial<SensorEntity>) {
        const record = this.sensorEntity.create(dto);
        return await this.sensorEntity.save(record);
    }

    async createMany(dtos: Partial<SensorEntity>[]) {
        const records = this.sensorEntity.create(dtos);
        return await this.sensorEntity.save(records);
    }

    // 하나의 센서를 ID로 찾는다.
    async findOneById(id: string) {
        const sql = this.sensorEntity.createQueryBuilder('record')
            .where('record.id = :id', { id })

        return await sql.getOne();
    }

    // 등록된 센서 조회
    async findManyById(id: string, skip: number = 0, take: number = 10, order: OrderEnum = OrderEnum.DESC, orderColumn: SensorColumns = SensorColumns.createdAt) {
        const sql = this.sensorEntity.createQueryBuilder('record')
            .where('record.id LIKE "%:id%"', { id })
            .orderBy(`record.${orderColumn}`, order)
            .skip(skip)
            .take(take);

        return await sql.getManyAndCount();
    }

    // 등록된 하나의 센서 수정
    async updateOneById(id: string, dto: Partial<SensorEntity>) {
        return await this.sensorEntity.update(id, dto)
    }

    // 하나의 센서를 삭제한다.
    async deleteOneById(id: string) {
        return await this.sensorEntity.delete(id);
    }

    // status조건에 맞는 센서 조회
    async findAllByStatus(status: SENSOR_STATUS_ENUM = SENSOR_STATUS_ENUM.NORMAL, order: OrderEnum = OrderEnum.DESC, orderColumn: SensorColumns = SensorColumns.id) {

        const sql = this.sensorEntity.createQueryBuilder('record')
            .where('record.status = :status', { status })
            .orderBy(`record.${orderColumn}`, order)

        return await sql.getMany();

    }

    // id를 이용해서 여러 records를 업데이트 한다.
    async updateManyByIds(ids: string[], dto: Partial<SensorEntity>) {

        if (Array.isArray(ids) && ids.length <= 0) return null; // ids에 빈값이 올경우 업데이트 하지 않음

        const sql = this.sensorEntity.createQueryBuilder()
            .update(SensorEntity)
            .set(dto)


        if (ids.length == 1) {
            sql.where('id = :id', { id: ids[0] })
        } else if (ids.length > 1) {
            sql.where('id IN(:...ids)', { ids })
        }

        return await sql.execute();
    }

    async findAllByIds(ids: string[]) {
        if (Array.isArray(ids) && ids.length <= 0) return [];
        const sql = this.sensorEntity.createQueryBuilder()
        if (ids.length == 1) {
            sql.where('id = :id', { id: ids[0] })
        } else if (ids.length > 1) {
            sql.where('id IN(:...ids)', { ids })
        }
        return await sql.getMany();
    }

    async findManyByOption(
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
        const sql = this.sensorEntity.createQueryBuilder('record')
            .leftJoinAndSelect('record.lastSensorPayload', 'payload')
            .where('1=1')
            .skip(skip)
            .take(take)
            .orderBy(`record.${orderColumn}`, order)

        if (id != '-') {
            sql.andWhere('record.id = :id', { id });
        }

        if (name != '-') {
            sql.andWhere('record.name = :name', { name });
        }

        if (model != '-') {
            sql.andWhere('record.model = :model', { name });
        }

        if (manufacturer != '-') {
            sql.andWhere('record.manufacturer = :manufacturer', { manufacturer });
        }

        if (startDate != '-' && endDate != '-') {
            sql.andWhere('record.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
        }

        if (sensorStartDate != '-' && sensorEndDate != '-') {
            sql.andWhere('record.timestamp BETWEEN :sensorStartDate AND :sensorEndDate', { sensorStartDate, sensorEndDate });
        }

        if (lastModeSelect != MODESELECT.전체) {
            sql.andWhere('record.lastMode = :lastMode', { lastMode: lastModeSelect })
        }

        if (statusSelect != SENSOR_STATUS_SELECT.전체) {
            sql.andWhere('record.status = :status', { status: statusSelect })
        }

        return await sql.getManyAndCount();


    }

    async getTotalStatus() {
        const sql = this.sensorEntity.createQueryBuilder('record')
            .select([
                `COUNT(CASE WHEN record.status = 'STANDBY' THEN 1 END) as standby`,
                `COUNT(CASE WHEN record.status = 'NORMAL' THEN 1 END) as normal`,
                `COUNT(CASE WHEN record.status = 'MALFUNCTION' THEN 1 END) as malfunction`
            ])
        // .select('record.status', 'status')
        // .addSelect('COUNT(record.id)', 'count')
        // .groupBy('record.status');

        const record = await sql.getRawOne();

        console.log("SensorRepository getTotalStatus record : ", record);

        return {
            standby: Number(record.standby),
            normal: Number(record.normal),
            malfunction: Number(record.malfunction),
        };

        // return records.map(ele => {
        //     return {
        //         status: ele['status'],
        //         count: Number(ele['count'])
        //     }
        // })
    }

}
