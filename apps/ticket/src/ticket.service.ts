import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import {TicketStatus} from './constants/ticket.status';
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
    private logger: Logger,
  ) {}

  public async create(createTicketDto: CreateTicketDto) {
    try {
      const { userId } = createTicketDto;
      const { data: userRequester } = await lastValueFrom(
        this.httpService.get(`${this.config.url.userApiUrl}/id/${userId}`),
      );

      if (!userRequester) {
        this.logger.error(ERROR_CONSTANTS.USER_NOT_FOUND_ON_CREATE_TICKET);
        throw new BadRequestException(
          ERROR_CONSTANTS.USER_NOT_FOUND_ON_CREATE_TICKET,
        );
      }

      return this.repository.create(createTicketDto);
    } catch (error) {
      this.logger.error(
        `${ERROR_CONSTANTS.ERROR_ON_CREATE_TICKET} - ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
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

      const canViewAllTickets = [USER_TYPES.ATTENDANT, USER_TYPES.ADMIN];
      if (canViewAllTickets.includes(user.type)) {
        where = {};
      }

      return this.repository.find(where).sort({ createdAt: -1 });
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }

  public async findOne(id: string, query: SearchTicketDto) {
    const { loggedUserDocument } = query;

    const ticket = await this.repository.findById(id);
    if (!ticket) {
      this.logger.error(ERROR_CONSTANTS.TICKET_NOT_FOUND);
      throw new NotFoundException();
    }

    const { data: user } = await lastValueFrom(
      this.httpService.get(
        `${this.config.url.userApiUrl}/${loggedUserDocument}`,
      ),
    );

    const canViewAllTickets = [USER_TYPES.ATTENDANT, USER_TYPES.ADMIN];
    const isAttendant = canViewAllTickets.includes(user.type);
    if (isAttendant) {
      return ticket;
    }
    if (ticket.userId !== user._id) {
      this.logger.error(ERROR_CONSTANTS.NON_AUTHORIZED(user._id));
      throw new UnauthorizedException(ERROR_CONSTANTS.NON_AUTHORIZED(user._id));
    }
    return ticket;
  }

  public async update(id: string, updateTicketDto: UpdateTicketDto) {
    if(updateTicketDto.attendantId) {
      updateTicketDto.status = TicketStatus.IN_PROGRESS;
    }
    return this.repository.updateOne({ _id: id }, updateTicketDto);
  }

  public async insertComment(id: string, comment: Comment) {
    try {
      const ticket = await this.repository.findById(id).lean();
      if (!ticket) {
        this.logger.error(ERROR_CONSTANTS.TICKET_NOT_FOUND);
        throw new NotFoundException();
      }
      const newComments: Comment[] = ticket.comments ?? [];
      newComments.push(comment);
      return this.repository.updateOne({ _id: id }, { comments: newComments });
    } catch (error) {
      this.logger.log(
        `${ERROR_CONSTANTS.ERROR_ON_INSERT_COMMENT} - ${error.message}`,
      );
      throw new InternalServerErrorException();
    }
  }

  public async removeComment(commentId: string, ticketId: string) {
    const ticket = await this.repository.findById(ticketId).lean();
    const { comments } = ticket;
    const commentIndex = comments.findIndex((item) => item.id === commentId);

    comments.splice(commentIndex, 1);
    return `comment ${commentId} of ticket ${ticketId} has been deleted`;
  }

  public async resolveTicket(id: string, resolveTicketDto: ResolveTicketDto) {
    try {
      const { loggedUserDocument } = resolveTicketDto;
      const { data: user } = await lastValueFrom(
        this.httpService.get(
          `${this.config.url.userApiUrl}/${loggedUserDocument}`,
        ),
      );

      const isAttendant = user.type == USER_TYPES.ATTENDANT;
      if (!isAttendant) {
        this.logger.log(
          ERROR_CONSTANTS.THIS_USER_HAS_NO_PERMISSION_TO_PERFORM_THIS_ACTION,
        );
        throw new UnauthorizedException(
          ERROR_CONSTANTS.THIS_USER_HAS_NO_PERMISSION_TO_PERFORM_THIS_ACTION,
        );
      }

      const updatePayload = { status: resolveTicketDto.status };

      return this.repository.updateOne({ _id: id }, updatePayload);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async delete(id: string) {
    return this.repository.deleteOne({ id });
  }
}
