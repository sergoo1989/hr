import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'hr-secret-key-2025',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.sub);
    return { 
      userId: payload.sub, 
      username: payload.username, 
      role: payload.role,
      employeeId: payload.employeeId,
      employee: user?.employee 
    };
  }
}
