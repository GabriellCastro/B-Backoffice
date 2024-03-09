import { JWTAuthenticationProvider } from 'src/@core/infraestructure/gateways/providers/token/token.provider';
import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';

import { ForgotPasswordUserUseCase } from './forgot-password-user.usecase';

export class ForgotPasswordUserUseCaseFactory {
  static create() {
    return new ForgotPasswordUserUseCase(
      new UserRepository(),
      new JWTAuthenticationProvider(),
    );
  }
}
