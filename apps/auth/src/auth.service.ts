import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(document: string, password: string) {
    try {
      const { data: user } = await this.httpService
        .get(`http://localhost:8001/users/${document}`)
        .toPromise();

      if (!user) {
        throw new HttpException(
          'Voce ainda nao está cadastrado, por favor faça o seu cadastro',
          400,
        );
      }
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        throw new HttpException('usuario ou senha incorretos', 400);
      }

      return user;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  public async login(loginDto: LoginDto) {
    const { document } = loginDto;
    const { data: user } = await this.httpService
      .get(`http://localhost:8001/users/${document}`)
      .toPromise();

    const jwtPayload = {
      sub: user.name,
      document: user.document,
      email: user.email,
    };

    const token = this.jwtService.sign(jwtPayload);

    return { user, access_token: token };
  }
}
