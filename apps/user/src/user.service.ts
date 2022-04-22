import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import errorConstants from '../constants/error.constants';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private repository: Model<UserDocument>,
  ) {}
  public async findAll() {
    return this.repository.find();
  }

  public async findOne(id: string) {
    return this.repository.findById(id);
  }

  public findByDocument(document: string) {
    return this.repository.findOne({ document: document });
  }

  public async create(createUserDto: CreateUserDto) {
    const PASSWORD_HASH_SALTS = 10;
    try {
      const userAlreadyExists = await this.findByDocument(
        createUserDto.document,
      );
      if (userAlreadyExists) {
        throw new HttpException(
          errorConstants.USER_ALREADY_EXISTS.message,
          errorConstants.USER_ALREADY_EXISTS.statusCode,
        );
      }

      const hashPassword = await bcrypt.hash(
        createUserDto.password,
        PASSWORD_HASH_SALTS,
      );

      createUserDto.password = hashPassword;

      return this.repository.create(createUserDto);
    } catch (error) {
      throw new HttpException(`ERRO_ON_CREATE_USER ${error}`, error.statusCode);
    }
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    return this.repository.updateOne({ id }, updateUserDto);
  }

  public async delete(id: string) {
    return this.repository.deleteOne({ id });
  }
}
