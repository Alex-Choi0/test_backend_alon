import { PartialType } from '@nestjs/swagger';
import { CreateServerErrorDto } from './create-server_error.dto';

export class UpdateServerErrorDto extends PartialType(CreateServerErrorDto) {}
