import { JWTAuthenticationProvider } from 'src/@core/infraestructure/gateways/providers/token/token.provider';

import { AuthGuard } from './auth.guard';

export class AuthGuardFactory {
  static create() {
    return new AuthGuard(new JWTAuthenticationProvider());
  }
}
