import { EncrypterProvider } from 'src/@core/infraestructure/gateways/providers/encrypter/encrypter.provider';
import { JWTAuthenticationProvider } from 'src/@core/infraestructure/gateways/providers/token/token.provider';
import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';

import { AuthenticateUserUseCase } from './authenticate-user.usecase';

export class AuthenticateUserUseCaseFactory {
  static create() {
    return new AuthenticateUserUseCase(
      new UserRepository(),
      new EncrypterProvider(),
      new JWTAuthenticationProvider(),
    );
  }
}
