import { InjectRepository } from "@nestjs/typeorm";
import { NoticEmailColumns, NoticEmailEntity } from "../entities/notic_email.entity";
import { Brackets, QueryRunnerProviderAlreadyReleasedError, Repository } from "typeorm";
import { AVAILABLE_SELECT, OrderEnum } from "src/enum";


export class NoticEmailRepository {
  constructor(
    @InjectRepository(NoticEmailEntity)
    private readonly noticEmailEntity: Repository<NoticEmailEntity>
  ) { }

  async createOne(dto: Partial<NoticEmailEntity>) {
    const record = this.noticEmailEntity.create(dto);
    return await this.noticEmailEntity.save(record);
  }

  async updateOneById(id: number, dto: Partial<NoticEmailEntity>) {
    return await this.noticEmailEntity.update(id, dto);
  }

  async updateOneByEmail(email: string, dto: Partial<NoticEmailEntity>) {
    return await this.noticEmailEntity.update({ email }, dto);
  }

  async findOneByEmail(email: string) {
    return await this.noticEmailEntity.findOneBy({ email });
  }

  async findOneById(id: number) {
    return await this.noticEmailEntity.findOneBy({ id });
  }

  async findManyOptions(keyword: string, skip: number, take: number, availableType: AVAILABLE_SELECT = AVAILABLE_SELECT.전체, order: OrderEnum = OrderEnum.DESC, orderColumn: NoticEmailColumns = NoticEmailColumns.id) {
    const sql = this.noticEmailEntity.createQueryBuilder('record')
      .where('1 = 1')
      .skip(skip)
      .take(take)
      .orderBy(`record.${orderColumn}`, order);

    if (keyword != '-') {
      keyword = `%${keyword}%`;
      sql.andWhere(new Brackets((qb) => {
        qb.orWhere('record.email LIKE :email', { email: keyword })
          .orWhere('record.name LIKE :name', { name: keyword })
          .orWhere('record.mobile LIKE :mobile', { mobile: keyword })
      }))
    }

    if (availableType != AVAILABLE_SELECT.전체) {
      sql.andWhere('record.available = :available', { available: availableType == AVAILABLE_SELECT.가능 });
    }

    return await sql.getManyAndCount();
  }

  async deleteOneById(id: number) {
    return await this.noticEmailEntity.delete(id);
  }

  async findAllByAvailable(availAbleType: AVAILABLE_SELECT = AVAILABLE_SELECT.가능, order: OrderEnum = OrderEnum.DESC, orderColumn: NoticEmailColumns = NoticEmailColumns.id) {
    const sql = this.noticEmailEntity.createQueryBuilder('record')
      .where('1 = 1')
      .orderBy(`record.${orderColumn}`, order);

    if (availAbleType != AVAILABLE_SELECT.전체) {
      sql.andWhere('record.available = :available', { available: availAbleType == AVAILABLE_SELECT.가능 });
    }

    return await sql.getMany();
  }
}
