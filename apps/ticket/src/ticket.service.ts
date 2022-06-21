import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ticketApiConfig } from './config/ticket.config';
import { CreateTicketDto } from './dto/create.ticket.dto';
import { UpdateTicketDto } from './dto/update.ticket.dto';
import { Ticket, TicketDocument } from './schemas/ticket.schema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private repository: Model<TicketDocument>,
    private httpService: HttpService,
    @Inject(ticketApiConfig.KEY)
    private config: ConfigType<typeof ticketApiConfig>,
  ) {}
  public async create(createTicketDto: CreateTicketDto) {
    try {
      const { userId, attendantId } = createTicketDto;
      const [{ data: userRequester }, { data: attendant }] = await Promise.all([
        this.httpService
          .get(`${this.config.url.userApiUrl}/id/${userId}`)
          .toPromise(),
        this.httpService
          .get(`${this.config.url.userApiUrl}/id/${attendantId}`)
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

  public async getAll(where: any) {
    return this.repository.find(where);
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
