import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private loginService: AuthService) {
    super({ usernameField: 'document' });
  }

  public async validate(document: string, password: string) {
    const user = await this.loginService.validateUser({ document, password });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
