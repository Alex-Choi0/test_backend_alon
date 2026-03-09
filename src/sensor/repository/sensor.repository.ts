import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SensorColumns, SensorEntity } from "../entities/sensor.entity";
import { Repository } from "typeorm";
import { OrderEnum } from "src/enum";

@Injectable()
export class SensorRepository {
    constructor(
        @InjectRepository(SensorEntity)
        private readonly sensorEntity : Repository<SensorEntity>
    ){}

    async createOne(dto : Partial<SensorEntity>){
        const record = this.sensorEntity.create(dto);
        return await this.sensorEntity.save(record);
    }

    // 하나의 센서를 ID로 찾는다.
    async findOneById(id : string){
        const sql = this.sensorEntity.createQueryBuilder('record')
        .where('record.id = :id', {id})

        return await sql.getOne();
    }

    findManySql(startDate : string, endDate : string, skip : number = 0, take : number = 10){
        const sql = this.sensorEntity.createQueryBuilder('record')
        .where('record.createdAt BETWEEN :startDate AND :endDate', {startDate, endDate})
        .skip(skip)
        .take(take);

        return sql;
    }

    // 등록된 센서 조회
    async findManyById(id : string, skip : number = 0, take : number = 10, order : OrderEnum = OrderEnum.DESC, orderColumn : SensorColumns = SensorColumns.createdAt ){
        const sql = this.sensorEntity.createQueryBuilder('record')
        .where('record.id LIKE "%:id%"', {id})
        .orderBy(`record.${orderColumn}`, order)
        .skip(skip)
        .take(take);

        return await sql.getManyAndCount();
    } 

    // 등록된 하나의 센서 수정
    async updateOneById(id : string, dto : Partial<SensorEntity>){
        return await this.sensorEntity.update(id, dto)
    }

    // 하나의 센서를 삭제한다.
    async deleteOneById(id : string){
        return await this.sensorEntity.delete(id);
    }

}