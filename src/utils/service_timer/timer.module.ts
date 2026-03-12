import { Module } from '@nestjs/common';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { ServerErrorModule } from 'src/server_error/server_error.module';

@Module({
  imports: [ServerErrorModule],
  controllers: [TimerController],
  providers: [TimerService],
  exports: [TimerService]
})
export class TimerModule { }
