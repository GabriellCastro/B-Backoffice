import { EncrypterProvider } from 'src/@core/infraestructure/gateways/providers/encrypter/encrypter.provider';
import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';

import { CreateUserUseCase } from './create-user.usecase';

export class CreateUserUseCaseFactory {
  static create() {
    return new CreateUserUseCase(new UserRepository(), new EncrypterProvider());
  }
}
