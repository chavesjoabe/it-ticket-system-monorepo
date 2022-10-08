import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  RequestMethod,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'jsonwebtoken';
import { ERROR_CONSTANTS } from '../constants/error.constants';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
      throw new HttpException(
        ERROR_CONSTANTS.MISSING_AUTHORIZATION,
        HttpStatus.FORBIDDEN,
      );
    }
    const loggedUser = decode(req.headers['authorization'].split(' ')[1]);

    const { body } = req;
    const user = {
      loggedUserName: loggedUser['sub'],
      loggedUserDocument: loggedUser['document'],
    };

    if (req.method === 'GET') {
      req.query['loggedUserName'] = user.loggedUserName + '';
      req.query['loggedUserDocument'] = user.loggedUserDocument + '';

      return next();
    }
    req.body = {
      ...body,
      ...user,
    };
    return next();
  }
}
