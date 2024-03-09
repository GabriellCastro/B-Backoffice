import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';
import { RoleInternal } from 'src/@core/shared/models/user.model';

import { IListUserUseCaseDto } from './list-user.dto';

export class ListUserUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    userAuthenticated,
    page,
    perPage,
    paginated = false,
  }: IListUserUseCaseDto) {
    const userAuthenticatedFound = await this.validateListUser({
      userAuthenticated,
    });

    const users = this.usersRepository.findAll(
      {
        page,
        perPage,
        paginated,
        userAuthenticated: userAuthenticatedFound,
      },
      {
        address: true,
        coordinates: true,
      },
    );

    return users;
  }

  private async validateListUser({ userAuthenticated }: IListUserUseCaseDto) {
    const userAuthenticatedFound = await this.usersRepository.find(
      userAuthenticated.id,
    );
    if (!userAuthenticatedFound)
      throw new Error('Usuário autenticado não encontrado.');

    const allowedRoles = [RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER];
    if (!allowedRoles.includes(userAuthenticatedFound.role))
      throw new Error('Operação não autorizada.');

    return userAuthenticatedFound;
  }
}
