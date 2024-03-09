import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';

import { ListUserUseCase } from './list-user.usecase';

export class ListUserUseCaseFactory {
  static create() {
    return new ListUserUseCase(new UserRepository());
  }
}
