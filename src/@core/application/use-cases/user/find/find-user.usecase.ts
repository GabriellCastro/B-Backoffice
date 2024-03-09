import { IUserRepository } from 'src/@core/application/gateways/repositories/user.repository';
import { IUserModel, RoleInternal } from 'src/@core/shared/models/user.model';

import { IUserAuthenticated } from '../create/create-user.dto';
import { IFindUserUseCaseDto } from './find-user.dto';

export class FindUserUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute({ idTarget, userAuthenticated }: IFindUserUseCaseDto) {
    const userTarget = await this.validateFindUser(userAuthenticated, idTarget);
    return userTarget;
  }

  private async validateFindUser(
    userAuthenticated: IUserAuthenticated,
    idTarget: string,
  ): Promise<IUserModel> {
    const userAuthenticatedFound = await this.usersRepository.find(
      userAuthenticated.id,
    );
    if (!userAuthenticatedFound)
      throw new Error('Usuário autenticado não encontrado.');

    const allowedRoles = [RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER];
    if (!allowedRoles.includes(userAuthenticatedFound.role))
      throw new Error('Operação não autorizada.');

    const userTarget = await this.usersRepository.find(idTarget, {
      address: true,
    });
    if (!userTarget) throw new Error('Usuário alvo não localizado.');

    if (
      userTarget.role === userAuthenticatedFound.role &&
      userAuthenticatedFound.id !== idTarget
    )
      throw new Error('Operação não autorizada.');

    if (
      userTarget.role === RoleInternal.ADMINISTRATOR &&
      userAuthenticatedFound.id !== idTarget
    )
      throw new Error('Operação não autorizada.');

    delete userTarget.password;
    delete userTarget.emailVerify;
    delete userTarget.passwordReset;
    return userTarget;
  }
}
