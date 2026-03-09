import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorCode {

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

  getErrorCode(message: string = 'Server Error', statusCode: number = -1) {

    try {
      console.log("init statusCode : ", statusCode);

      if (statusCode < 0) {
        const errorData: { message: string, statusCode: number } = JSON.parse(message);
        message = errorData['message'];
        statusCode = errorData['statusCode']
      }
    } catch (err) {

    }

    console.log('incomming error message : ', message);
    console.log('imcomming error type : ', typeof message);

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

    throw new HttpException(message, statusCode)
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
