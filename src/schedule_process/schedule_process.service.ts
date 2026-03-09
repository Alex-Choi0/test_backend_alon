import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServerErrorService } from 'src/server_error/server_error.service';

@Injectable()
export class ScheduleProcessService {
  constructor(
    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService,
  ) { }

  private errorLocation = 'ScheduleProcessService';

  @Cron('0 */2 * * * *')
  async scheduleActive() {
    try {

      console.log("schedulaActive time : ", new Date());

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }
}
