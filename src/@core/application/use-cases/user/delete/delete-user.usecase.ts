import { UserRepository } from 'src/@core/infraestructure/gateways/repositories/prisma/user.repository';
import { RoleInternal } from 'src/@core/shared/models/user.model';

import { IUserAuthenticated } from '../create/create-user.dto';
import { IDeleteUserUseCaseDto } from './delete-user.dto';

export class DeleteUserUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({ idTarget, userAuthenticated }: IDeleteUserUseCaseDto) {
    await this.validateDeleteUser(userAuthenticated, idTarget);
    await this.usersRepository.delete(idTarget);
  }

  private async validateDeleteUser(
    userAuthenticated: IUserAuthenticated,
    idTarget: string,
  ): Promise<void> {
    const userAuthenticatedFound = await this.usersRepository.find(
      userAuthenticated.id,
    );
    if (!userAuthenticatedFound)
      throw new Error('Usuário autenticado não encontrado.');

    const allowedRoles = [RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER];
    if (!allowedRoles.includes(userAuthenticatedFound.role))
      throw new Error('Operação não autorizada.');

    const userTarget = await this.usersRepository.find(idTarget);
    if (!userTarget) throw new Error('Usuário alvo não localizado.');

    if (userTarget.role === RoleInternal.ADMINISTRATOR)
      throw new Error('Operação não autorizada.');
    if (userTarget.role === userAuthenticatedFound.role)
      throw new Error(
        'Operação não autorizada: não é possível deletar um usuário com o mesmo papel do autenticado.',
      );
  }
}
