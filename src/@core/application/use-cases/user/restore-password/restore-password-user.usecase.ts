import { IEncrypterProvider } from 'src/@core/application/gateways/providers/encrypter/encrypter.provider.interface';
import { ITokenAuthenticationProvider } from 'src/@core/application/gateways/providers/token/token.provider.interface';
import { IUserRepository } from 'src/@core/application/gateways/repositories/user.repository';
import { IUserModel, RoleInternal } from 'src/@core/shared/models/user.model';

import { IRestorePasswordUserUseCaseDto } from './restore-password-user.dto';

export class RestorePasswordUserUseCase {
  constructor(
    private usersRepository: IUserRepository,
    private tokenAuthenticationProvider: ITokenAuthenticationProvider,
    private encrypterProvider: IEncrypterProvider,
  ) {}

  async execute(input: IRestorePasswordUserUseCaseDto): Promise<void> {
    if (!input.token) throw new Error('Informar um token é obrigatório.');
    if (!input.password)
      throw new Error('Informar uma nova senha é obrigatório.');

    const decoded = this.tokenAuthenticationProvider.verifyToken({
      secret: process.env.JWT_SECRET,
      token: input.token,
    });

    const userFound = await this.validateRecoveryPassword(
      decoded.email as string,
      input.token,
    );

    const passwordHashed = await this.encrypterProvider.hash(
      input.password as string,
      8,
    );

    await this.usersRepository.update({
      id: userFound.id,
      passwordReset: null,
      password: passwordHashed,
    } as IUserModel);
  }

  private async validateRecoveryPassword(email: string, token: string) {
    const userFound = await this.usersRepository.findByEmail(email);
    if (!userFound) throw new Error('Usuário não encontrado.');

    if (!userFound.activated)
      throw new Error(
        'Operação não autorizada: usuário deve estar ativado, confirme seu email para ativar sua conta.',
      );
    if (!userFound.passwordReset)
      throw new Error('Usuário não solicitou mudança de senha.');
    if (userFound.passwordReset !== token) throw new Error('Token inválido.');

    const allowedRoles = [RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER];
    if (!allowedRoles.includes(userFound.role))
      throw new Error('Operação não autorizada.');

    return userFound;
  }
}
