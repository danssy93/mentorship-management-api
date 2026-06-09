import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth/auth.service';
import { IJwtDecodedToken } from 'src/common/interfaces';
import AppError from 'src/common/errors/AppError';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_SECRET,
    });
  }

  async validate(payload: IJwtDecodedToken) {
    const user = await this.authService.validateUser(payload.sub);

    if (!user || !user.is_active) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
