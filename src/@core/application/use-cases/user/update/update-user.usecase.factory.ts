import { EncrypterProvider } from 'src/@core/infraestructure/gateways/providers/encrypter/encrypter.provider';
import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';

import { UpdateUserUseCase } from './update-user.usecase';

export class UpdateUserUseCaseFactory {
  static create() {
    return new UpdateUserUseCase(new UserRepository(), new EncrypterProvider());
  }
}
