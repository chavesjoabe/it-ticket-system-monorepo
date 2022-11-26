import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create.ticket.dto';
import {SearchTicketDto} from './dto/search.ticket.dto';
import { UpdateTicketDto } from './dto/update.ticket.dto';
import { TicketService } from './ticket.service';
import { Comment } from './dto/create.ticket.dto';
import {ResolveTicketDto} from './dto/resolve.ticket.dto';

@ApiTags('Ticket')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  public async create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Post('insert-comment/:id')
  public async insertComment(@Param('id') id: string, @Body() comment: Comment) {
    return this.ticketService.insertComment(id, comment)
  };

  @Get()
  public async getAll(@Query() where: any) {
    return this.ticketService.getAll(where);
  }


  @Get('/:id')
  public async findOne(@Param('id') id: string, @Query() query: SearchTicketDto) {
    return this.ticketService.findOne(id, query);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Put('resolve-ticket/:id')
  public resolveTicket(@Param('id') id: string, @Body() resolveTicketDto: ResolveTicketDto) {
    return this.ticketService.resolveTicket(id, resolveTicketDto);
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    return this.ticketService.delete(id);
  }
}
