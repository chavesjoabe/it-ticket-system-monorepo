import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ticketApiConfig } from './config/ticket.config';
import { ERROR_CONSTANTS } from './constants/error.constants';
import { USER_TYPES } from './constants/user.types';
import { Comment, CreateTicketDto } from './dto/create.ticket.dto';
import { SearchTicketDto } from './dto/search.ticket.dto';
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
        lastValueFrom(
          this.httpService.get(`${this.config.url.userApiUrl}/id/${userId}`),
        ),
        lastValueFrom(
          this.httpService.get(
            `${this.config.url.userApiUrl}/id/${attendantId}`,
          ),
        ),
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

  public async findOne(id: string, query: SearchTicketDto) {
    const { loggedUserDocument } = query;

    const ticket = await this.repository.findById(id);
    if (!ticket) {
      throw new NotFoundException();
    }

    const { data: user } = await lastValueFrom(
      this.httpService.get(
        `${this.config.url.userApiUrl}/${loggedUserDocument}`,
      ),
    );

    const isAttendant = user.type == USER_TYPES.ATTENDANT.toString();
    if (isAttendant) {
      return ticket;
    }
    if (ticket.userId !== user._id) {
      throw new UnauthorizedException(ERROR_CONSTANTS.NON_AUTHORIZED(user._id));
    }
    return ticket;
  }

  public async update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.repository.updateOne({ id }, updateTicketDto);
  }

  public async insertComment(id: string, comment: Comment) {
    const ticket = await this.repository.findById(id);

    if (!ticket) {
      throw new NotFoundException();
    }
    const newComments: Comment[] = ticket.comments ?? [];

    newComments.push(comment);

    return this.update(id, { comments: newComments });
  }

  public async delete(id: string) {
    return this.repository.deleteOne({ id });
  }
}
