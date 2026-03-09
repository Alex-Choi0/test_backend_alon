import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateServerErrorDto } from './dto/create-server_error.dto';
import { UpdateServerErrorDto } from './dto/update-server_error.dto';
import { ServerErrorRepository } from './repository/server_error.repository';
import { W } from 'typeorm';

@Injectable()
export class ServerErrorService {

  constructor(
    @Inject(ServerErrorRepository)
    private readonly serverErrorRepository: ServerErrorRepository,
  ) { }

  // 서버 에러 메세지를 string으로 변환
  private convertErrorCodeToJson(message: string = 'Server Error', statusCode: number = -1) {
    return JSON.stringify({
      message, statusCode
    })
  }

  generateError(message: string = 'Server Error', statusCode: number = -1) {
    if (statusCode < 0) {
      throw new Error(message)
    } else {
      const errorData: string = this.convertErrorCodeToJson(message, statusCode)
      throw new Error(errorData)
    }
  }

  async getErrorCode(message: string = 'Server Error', statusCode: number = -1) {

    try {
      console.log("init statusCode : ", statusCode);

      if (statusCode < 0) {
        const errorData: { message: string, statusCode: number } = JSON.parse(message);
        message = errorData['message'];
        statusCode = errorData['statusCode']
      }
    } catch (err) {
      // DB에 저장
      await this.serverErrorRepository.createOne({
        statusCode,
        note: 'getErrorCode Error : ' + message
      })

    }

    console.log('incomming error message : ', message);
    console.log('imcomming error type : ', typeof message);

    // DB에 저장
    const record = await this.serverErrorRepository.createOne({
      statusCode,
      note: message
    })

    console.log("save Error Record : ", record);

    if (statusCode > 0) {
      throw new HttpException(message, statusCode)
    }
    else if (
      this.CONFLICT.find(ele => ele == message)
    ) {
      statusCode = HttpStatus.CONFLICT;
    } else if (
      this.BAD_REQUEST.find(ele => ele == message)
    ) {
      statusCode = HttpStatus.BAD_REQUEST;
    } else if (
      this.FORBIDDEN.find(ele => ele == message)
    ) {
      statusCode = HttpStatus.FORBIDDEN;
    } else if (
      this.NOT_FOUND.find(ele => ele == message)
    ) {
      statusCode = HttpStatus.NOT_FOUND;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    }





    // throw new HttpException(message, statusCode)
  }

  CONFLICT = [
    '이미 존재하는 디바이스입니다.',
  ]

  BAD_REQUEST = [
    '과거시간으로 설정할수 없습니다.'
  ]

  FORBIDDEN = [
    '허가되지 않은 요청입니다.'
  ]

  NOT_FOUND = [
    '존재하지 않는 ID입니다.',
    '존재하지 않는 code 입니다.',
    '존재하지 않는 시리얼번호 입니다.'
  ]
}
