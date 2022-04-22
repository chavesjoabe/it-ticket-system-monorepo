import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create.ticket.dto';
import { UpdateTicketDto } from './dto/update.ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private repository: Model<TicketDocument>,
  ) {}
  public async create(createTicketDto: CreateTicketDto) {
    return this.repository.create(createTicketDto);
  }

  public async getAll() {
    return this.repository.find();
  }

  public async getOne(id: string) {
    return this.repository.findById(id);
  }

  public async update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.repository.updateOne({ id }, updateTicketDto);
  }

  public async delete(id: string) {
    return this.repository.deleteOne({ id });
  }
}
