import {IsIn, IsOptional, IsString} from "class-validator";
import {TicketStatus} from "../constants/ticket.status";

export class ResolveTicketDto {
  @IsString()
  @IsIn(Object.values(TicketStatus))
  status: string

  // this fields are inserted via jwt.middleware
  @IsString()
  @IsOptional()
  loggedUserName?: string;

  @IsString()
  @IsOptional()
  loggedUserDocument?: string;
}
