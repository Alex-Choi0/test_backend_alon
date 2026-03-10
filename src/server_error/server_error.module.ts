import { Module } from '@nestjs/common';
import { ServerErrorService } from './server_error.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerErrorEntity } from './entities/server_error.entity';
import { ServerErrorRepository } from './repository/server_error.repository';

@Module({
  imports : [TypeOrmModule.forFeature([ServerErrorEntity])],
  providers: [ServerErrorService, ServerErrorRepository],
  exports : [ServerErrorService]
})
export class ServerErrorModule {}
