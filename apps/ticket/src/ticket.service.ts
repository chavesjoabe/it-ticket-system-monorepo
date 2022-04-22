import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create.ticket.dto';
import { UpdateTicketDto } from './dto/update.ticket.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private repository: Model<TicketDocument>,
    private httpService: HttpService,
  ) {}
  public async create(createTicketDto: CreateTicketDto) {
    try {
      const { userId, attendantId } = createTicketDto;
      const [{ data: userRequester }, { data: attendant }] = await Promise.all([
        this.httpService
          .get(`http://localhost:8001/users/id/${userId}`)
          .toPromise(),
        this.httpService
          .get(`http://localhost:8001/users/id/${attendantId}`)
          .toPromise(),
      ]);

      if (!userRequester || !attendant) {
        throw new HttpException(
          'Error on create ticket - users not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.repository.create(createTicketDto);
    } catch (error) {
      throw new Error(error);
    }
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
