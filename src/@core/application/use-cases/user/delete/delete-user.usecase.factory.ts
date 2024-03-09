import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';

import { DeleteUserUseCase } from './delete-user.usecase';

export class DeleteUserUseCaseFactory {
  static create() {
    return new DeleteUserUseCase(new UserRepository());
  }
}
