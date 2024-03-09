import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';

import { FindUserUseCase } from './find-user.usecase';

export class FindUserUseCaseFactory {
  static create() {
    return new FindUserUseCase(new UserRepository());
  }
}
