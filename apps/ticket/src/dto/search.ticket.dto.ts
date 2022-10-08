import {PartialType} from '@nestjs/swagger';
import {IsOptional, IsString} from 'class-validator';
import {CreateTicketDto} from './create.ticket.dto';

export class SearchTicketDto extends PartialType(CreateTicketDto){
  @IsString()
  @IsOptional()
  loggedUserDocument?: string;

  @IsString()
  @IsOptional()
  loggedUserName?: string;
}
