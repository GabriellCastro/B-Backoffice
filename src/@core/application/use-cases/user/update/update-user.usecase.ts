import { IEncrypterProvider } from 'src/@core/application/gateways/providers/encrypter/encrypter.provider.interface';
import { IUserRepository } from 'src/@core/application/gateways/repositories/user.repository';
import { RoleInternal } from 'src/@core/shared/models/user.model';

import { IUpdateUserUseCaseDto } from './update-user.dto';

export class UpdateUserUseCase {
  constructor(
    private usersRepository: IUserRepository,
    private encrypterProvider: IEncrypterProvider,
  ) {}

  async execute({
    input,
    userAuthenticated,
  }: IUpdateUserUseCaseDto): Promise<void> {
    await this.validateUserUpdate({
      input,
      userAuthenticated,
    });

    let passwordHashed = undefined;
    if (input.password) {
      passwordHashed = await this.encrypterProvider.hash(
        input.password as string,
        8,
      );
    }

    await this.usersRepository.update({
      id: input.id,
      email: input.email,
      name: input.name,
      address: input.address,
      cpf: input.cpf,
      whatsApp: input.whatsApp,
      password: passwordHashed,
      role: input.role,
      profile: input.profile,
      coordinates: input.coordinates,
    });
  }

  private async validateUserUpdate({
    input,
    userAuthenticated,
  }: IUpdateUserUseCaseDto): Promise<void> {
    if (!input.id) throw new Error('Usuário alvo não encontrado.');

    if (input.role === RoleInternal.ADMINISTRATOR)
      throw new Error(
        'Operação não autorizada: mudança de role para ADMINISTRATOR não é permitida.',
      );

    const userAuthenticatedFound = await this.usersRepository.find(
      userAuthenticated.id,
    );

    if (!userAuthenticatedFound)
      throw new Error('Usuário autenticado não encontrado.');

    const allowedRoles = [RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER];
    if (!allowedRoles.includes(userAuthenticatedFound.role))
      throw new Error('Operação não autorizada.');

    if (!input.role && input.profile)
      throw new Error('Informe a permissão para atualizar o perfil.');

    if (input.role === RoleInternal.OPERATOR && !input.profile)
      throw new Error('Faltando informação de perfil para usuário operador.');

    if (input.role === userAuthenticatedFound.role)
      throw new Error(
        'Operação não autorizada: não é possível atualizar um usuário para o mesmo papel do autenticado.',
      );

    if (userAuthenticatedFound.id === input.id && input.role)
      throw new Error(
        'Operação não autorizada: não é possível atualizar a própria role.',
      );

    if (input.email && input.id === input.role)
      throw new Error(
        'Operação não autorizada: não é possível atualizar o próprio email.',
      );

    if (
      input.password &&
      userAuthenticatedFound.role !== RoleInternal.ADMINISTRATOR
    )
      throw new Error(
        'Operação não autorizada: apenas ADMINISTRADOR pode atualizar senha.',
      );

    const existingUser = await this.usersRepository.find(input.id);
    if (!existingUser) throw new Error('Usuário alvo não encontrado.');

    if (input.email && input.email !== existingUser.email) {
      const emailAlreadyRegistered = await this.usersRepository.findByEmail(
        input.email,
      );
      if (emailAlreadyRegistered) throw new Error('Email já registrado.');
    }

    if (input.cpf && input.cpf !== existingUser.cpf) {
      const existingCpf = await this.usersRepository.findByCpf(input.cpf);
      if (existingCpf) throw new Error('CPF já cadastrado no sistema.');
    }

    if (existingUser.role === userAuthenticatedFound.role)
      throw new Error(
        'Operação não autorizada: não é possível atualizar usuário de mesma role.',
      );
  }
}
