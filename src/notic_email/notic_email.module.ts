import { Module } from '@nestjs/common';
import { NoticEmailService } from './notic_email.service';
import { NoticEmailController } from './notic_email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticEmailEntity } from './entities/notic_email.entity';
import { ServerErrorModule } from 'src/server_error/server_error.module';
import { NoticEmailRepository } from './repository/notic_email.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NoticEmailEntity]), ServerErrorModule],
  controllers: [NoticEmailController],
  providers: [NoticEmailService, NoticEmailRepository],
  exports: [NoticEmailService]
})
export class NoticEmailModule { }
