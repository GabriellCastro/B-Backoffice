import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';

import { ConfirmEmailUserUseCase } from './confirm-email-user.usecase';

export class ConfirmEmailUserUseCaseFactory {
  static create() {
    return new ConfirmEmailUserUseCase(new UserRepository());
  }
}
