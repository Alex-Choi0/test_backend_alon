import { Injectable } from "@nestjs/common";
import { ServerErrorColumns, ServerErrorEntity } from "../entities/server_error.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderEnum } from "src/enum";

@Injectable()
export class ServerErrorRepository {

    constructor(
        @InjectRepository(ServerErrorEntity)
        private readonly serverErrorEntity : Repository<ServerErrorEntity>
    ){}

    async createOne(dto : Partial<ServerErrorEntity>){
        const record = this.serverErrorEntity.create(dto);
        return await this.serverErrorEntity.save(record);
    }

    async findManyByDate(startDate : string, endDate : string,skip : number = 0, take : number = 10, order : OrderEnum = OrderEnum.DESC, orderColumn : ServerErrorColumns = ServerErrorColumns.createdAt){
        const sql = this.serverErrorEntity.createQueryBuilder('record')
        .where('record.createdAt BETWEEN :startDate AND :endDate', {startDate, endDate})
        .skip(skip)
        .take(take)
        .orderBy(`record.${orderColumn}`, order);

        return await sql.getManyAndCount();
    }


}