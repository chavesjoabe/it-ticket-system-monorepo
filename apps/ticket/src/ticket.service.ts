import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ticketApiConfig } from './config/ticket.config';
import { ERROR_CONSTANTS } from './constants/error.constants';
import { USER_TYPES } from './constants/user.types';
import { Comment, CreateTicketDto } from './dto/create.ticket.dto';
import { ResolveTicketDto } from './dto/resolve.ticket.dto';
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
      const { userId } = createTicketDto;
      const { data: userRequester } = await lastValueFrom(
        this.httpService.get(`${this.config.url.userApiUrl}/id/${userId}`),
      );

      if (!userRequester) {
        throw new BadRequestException(
          ERROR_CONSTANTS.USER_NOT_FOUND_ON_CREATE_TICKET,
        );
      }

      return this.repository.create(createTicketDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAll(where: any) {
    const { loggedUserDocument } = where;
    try {
      const { data: user } = await lastValueFrom(
        this.httpService.get(
          `${this.config.url.userApiUrl}/${loggedUserDocument}`,
        ),
      );

      if (user.type === USER_TYPES.ATTENDANT) {
        where = {};
      }

      return this.repository.find(where);
    } catch (error) {
      throw new UnprocessableEntityException();
    }
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

    const isAttendant = user.type == USER_TYPES.ATTENDANT
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
    const ticket = await this.repository.findById(id).lean();
    if (!ticket) {
      throw new NotFoundException();
    }
    const newComments: Comment[] = ticket.comments ?? [];
    newComments.push(comment);
    return this.repository.updateOne({ _id: id }, { comments: newComments });
  }

  public async resolveTicket(id: string, resolveTicketDto: ResolveTicketDto) {
    const { loggedUserDocument } = resolveTicketDto;
    const { data: user } = await lastValueFrom(
      this.httpService.get(
        `${this.config.url.userApiUrl}/${loggedUserDocument}`,
      ),
    );

    const isAttendant = user.type == USER_TYPES.ATTENDANT;
    if (!isAttendant) {
      throw new UnauthorizedException(
        ERROR_CONSTANTS.THIS_USER_HAS_NO_PERMISSION_TO_PERFORM_THIS_ACTION,
      );
    }

    const updatePayload = { status: resolveTicketDto.status };

    return this.repository.updateOne({ _id: id }, updatePayload);
  }

  public async delete(id: string) {
    return this.repository.deleteOne({ id });
  }
}
