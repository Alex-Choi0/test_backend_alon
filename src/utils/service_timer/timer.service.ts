import { date } from '@hapi/joi';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimerService {
  // 날짜와 일을 입력받으면 현재 날짜에 일수를 더해서 해당 날짜를 출력
  calDateTime(date: Date, days: number): Date {
    const resultDate = new Date(date);
    resultDate.setDate(resultDate.getDate() + days);
    return resultDate;
  }

  /**
   *
   * 두개의 날짜(Date) 사이의 날수를 응답한다.
   * @param date1
   * @param date2
   * @returns number
   */
  calculateDaysBetween(date1: Date, date2: Date) {
    // 두 날짜를 밀리초로 변환
    const msInDay = 24 * 60 * 60 * 1000; // 1일은 86,400,000밀리초
    const diffInMs = Math.abs(
      new Date(date2).getTime() - new Date(date1).getTime(),
    ); // 날짜 차이를 절대값으로 계산

    console.log('TimerService calculateDaysBetween diffInMs : ', diffInMs);

    // 밀리초를 일(days)로 변환
    return Number(Math.round(diffInMs / msInDay).toFixed(0));
  }

  /**
   *
   * 두개의 날짜(Date) 사이의 초를 응답한다.
   * @param date1
   * @param date2
   * @returns number
   */
  calculateSecondBetween(date1: Date, date2: Date) {
    console.log('date1 : ', date1);
    console.log('date2 : ', date2);
    const diffInMs = Math.abs(
      new Date(date2).getTime() - new Date(date1).getTime(),
    ); // 날짜 차이를 절대값으로 계산

    console.log('diffInMs : ', diffInMs);

    const result = Number(Math.round(diffInMs / 1000).toFixed(0));

    console.log("실제 시간차이 : ", result);

    return result;
  }

  changeToUTC(datetime: string): string {
    const data = new Date(datetime);

    if (isNaN(data.getTime())) {
      throw new Error('잘못된 시간입니다.');
    }

    return data.toISOString();
  }
}
