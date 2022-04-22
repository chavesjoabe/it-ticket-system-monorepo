import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTicketDto } from './dto/create.ticket.dto';
import { UpdateTicketDto } from './dto/update.ticket.dto';
import { TicketService } from './ticket.service';

@UseGuards(AuthGuard('jwt'))
@Controller('/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  public async create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  public async getAll() {
    return this.ticketService.getAll();
  }

  @Get('/:id')
  public async getOne(@Param('id') id: string) {
    return this.ticketService.getOne(id);
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    return this.ticketService.delete(id);
  }
}
