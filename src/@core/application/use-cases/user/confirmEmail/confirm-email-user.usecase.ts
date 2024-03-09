import { IUserRepository } from 'src/@core/application/gateways/repositories/user.repository';

import { IConfirmEmailUserUseCaseDto } from './confirm-email-user.dto';

export class ConfirmEmailUserUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute({ token }: IConfirmEmailUserUseCaseDto): Promise<void> {
    if (!token) throw new Error('Token não informado.');
    const userUpdated = await this.usersRepository.confirmEmail(token);
    if (!userUpdated) throw new Error('Token inválido.');
  }
}
