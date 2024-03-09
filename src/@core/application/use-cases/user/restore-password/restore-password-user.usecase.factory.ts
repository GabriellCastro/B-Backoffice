import { EncrypterProvider } from 'src/@core/infraestructure/gateways/providers/encrypter/encrypter.provider';
import { JWTAuthenticationProvider } from 'src/@core/infraestructure/gateways/providers/token/token.provider';
import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';

import { RestorePasswordUserUseCase } from './restore-password-user.usecase';

export class RestorePasswordUserUseCaseFactory {
  static create() {
    return new RestorePasswordUserUseCase(
      new UserRepository(),
      new JWTAuthenticationProvider(),
      new EncrypterProvider(),
    );
  }
}
