import { Inject, Injectable } from '@nestjs/common';
import { NoticEmailRepository } from './repository/notic_email.repository';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { NoticEmailColumns, NoticEmailEntity } from './entities/notic_email.entity';
import { AVAILABLE_SELECT, OrderEnum } from 'src/enum';
import { CreateOneNoticEmailDto } from './dto/create-one-notic_email.dto';
import { UpdateOneNoticEmailDto } from './dto/update-one-notic_email.dto';

@Injectable()
export class NoticEmailService {

  constructor(
    @Inject(NoticEmailRepository)
    private readonly noticEmailRepository: NoticEmailRepository,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService
  ) { }

  private errorLocation = 'NoticEmailService'

  async createOne(dto: CreateOneNoticEmailDto) {
    try {

      const existEmail = await this.noticEmailRepository.findOneByEmail(dto.email);

      if (existEmail) throw new Error('이미 존재하는 이메일 입니다.');

      return await this.noticEmailRepository.createOne(dto);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  async updateOneById(id: number, dto: UpdateOneNoticEmailDto) {
    try {
      return await this.noticEmailRepository.updateOneById(id, dto);
    } catch (err) {
      await this.serverErrorService.getErrorCode(
        this.errorLocation,
        err['message'],
        err['statusCode']
      );
    }
  }

  async updateOneByEmail(email: string, dto: Partial<NoticEmailEntity>) {
    try {
      return await this.noticEmailRepository.updateOneByEmail(email, dto);
    } catch (err) {
      await this.serverErrorService.getErrorCode(
        this.errorLocation,
        err['message'],
        err['statusCode']
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.noticEmailRepository.findOneByEmail(email);
    } catch (err) {
      await this.serverErrorService.getErrorCode(
        this.errorLocation,
        err['message'],
        err['statusCode']
      );
    }
  }

  async findOneById(id: number) {
    try {
      return await this.noticEmailRepository.findOneById(id);
    } catch (err) {
      await this.serverErrorService.getErrorCode(
        this.errorLocation,
        err['message'],
        err['statusCode']
      );
    }
  }

  async findManyOptions(
    keyword: string,
    skip: number,
    take: number,
    availableType: AVAILABLE_SELECT = AVAILABLE_SELECT.전체,
    order: OrderEnum = OrderEnum.DESC,
    orderColumn: NoticEmailColumns = NoticEmailColumns.id
  ) {
    try {
      return await this.noticEmailRepository.findManyOptions(
        keyword,
        skip,
        take,
        availableType,
        order,
        orderColumn
      );
    } catch (err) {
      await this.serverErrorService.getErrorCode(
        this.errorLocation,
        err['message'],
        err['statusCode']
      );
    }
  }

  async deleteOneById(id: number) {
    try {
      return await this.noticEmailRepository.deleteOneById(id);
    } catch (err) {
      await this.serverErrorService.getErrorCode(
        this.errorLocation,
        err['message'],
        err['statusCode']
      );
    }
  }

}
