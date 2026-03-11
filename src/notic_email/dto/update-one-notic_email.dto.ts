import { PartialType } from '@nestjs/swagger';
import { CreateOneNoticEmailDto } from './create-one-notic_email.dto';

export class UpdateOneNoticEmailDto extends PartialType(CreateOneNoticEmailDto) { }
