import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTAuthenticationProvider } from 'src/@core/infraestructure/gateways/providers/token/token.provider';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtAuthenticationProvider: JWTAuthenticationProvider,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new UnauthorizedException();

      const token = authHeader.slice(7);

      const decodedToken = this.jwtAuthenticationProvider.verifyToken({
        token,
        secret: process.env.JWT_SECRET,
      });

      if (!decodedToken) throw new UnauthorizedException();

      request.user = decodedToken;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
