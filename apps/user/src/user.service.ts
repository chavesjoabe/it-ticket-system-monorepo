import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import errorConstants from '../constants/error.constants';
import { CreateUserDto } from './dto/create.user.dto';
import { SearchUserDto } from './dto/search.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private repository: Model<UserDocument>,
    private logger: Logger,
  ) {}

  public async findAll(where: SearchUserDto) {
    this.logger.log(
      `${this.findAll.name} method called with ${JSON.stringify(
        where,
      )} filters`,
    );
    return this.repository.find(where);
  }

  public async findOne(id: string) {
    this.logger.log(`${this.findOne.name} method called for ID ${id}`);
    return this.repository.findById(id);
  }

  public findByDocument(document: string) {
    this.logger.log(
      `${this.findByDocument.name} method for document ${document}`,
    );
    return this.repository.findOne({ document: document });
  }

  public async create(createUserDto: CreateUserDto) {
    this.logger.log(
      `${this.create.name} method called with ${JSON.stringify(
        createUserDto,
      )} payload`,
    );
    const PASSWORD_HASH_SALTS = 10;
    try {
      const userAlreadyExists = await this.findByDocument(
        createUserDto.document,
      );
      if (userAlreadyExists) {
        throw new BadRequestException(
          errorConstants.USER_ALREADY_EXISTS.message,
        );
      }

      const hashPassword = await bcrypt.hash(
        createUserDto.password,
        PASSWORD_HASH_SALTS,
      );

      createUserDto.password = hashPassword;

      return this.repository.create(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException(
        `${errorConstants.ERROR_ON_CREATE_USER} - ${error.message}`,
      );
    }
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(
      `${this.update.name} method called with ${JSON.stringify(
        updateUserDto,
      )} payload`,
    );
    return this.repository.updateOne({ id }, updateUserDto);
  }

  public async delete(id: string) {
    this.logger.log(`${this.delete.name} method called with ${id} payload`);
    return this.repository.deleteOne({ id });
  }
}
