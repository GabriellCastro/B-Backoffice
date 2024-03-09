import { IEncrypterProvider } from 'src/@core/application/gateways/providers/encrypter/encrypter.provider.interface';
import { IMailerProvider } from 'src/@core/application/gateways/providers/mailer/mailer.provider.interface';
import { IUserRepository } from 'src/@core/application/gateways/repositories/user.repository';
import { RoleInternal } from 'src/@core/shared/models/user.model';

import { ICreateUserUseCaseDto } from './create-user.dto';

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUserRepository,
    private encrypterProvider: IEncrypterProvider,
  ) {}

  async execute(
    { input, userAuthenticated }: ICreateUserUseCaseDto,
    mailerService: IMailerProvider,
  ): Promise<void> {
    await this.validateUserCreation({ input, userAuthenticated });

    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const token = await this.encrypterProvider.hash(
      input.email + randomNumber,
      8,
    );
    const url = `${process.env.EMAIL_CONFIRMATION_URL_REDIRECT}?token=${token}`;

    if ([RoleInternal.MANAGER].includes(input.role)) {
      try {
        await mailerService.sendMail({
          to: input.email,
          from: `"No Reply" <${process.env.MAIL_FROM}>`,
          subject: 'GDT - Confirmação de e-mail',
          template: './confirmationEmail',
          context: {
            url,
            username: input.name,
            email: input.email,
          },
        });
      } catch {
        throw new Error('Falha ao enviar email.');
      }
    }

    const passwordHashed = await this.encrypterProvider.hash(
      input.password as string,
      8,
    );

    await this.usersRepository.create({
      email: input.email,
      name: input.name,
      password: passwordHashed,
      address: input.address,
      whatsApp: input.whatsApp,
      cpf: input.cpf,
      role: input.role,
      emailVerify: token,
      profile: input.profile,
      coordinates: input.coordinates,
    });
  }

  private async validateUserCreation({
    input,
    userAuthenticated,
  }: ICreateUserUseCaseDto): Promise<void> {
    if (input.role === RoleInternal.ADMINISTRATOR)
      throw new Error(
        'Operação não autorizada: a criação de usuários com papel de ADMINISTRATOR não é permitida.',
      );

    const userAuthenticatedFound = await this.usersRepository.findByEmail(
      userAuthenticated.email,
    );

    if (!userAuthenticatedFound)
      throw new Error('Usuário autenticado não encontrado.');

    const allowedRoles = [RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER];
    if (!allowedRoles.includes(userAuthenticatedFound.role))
      throw new Error('Operação não autorizada.');

    if (input.role === RoleInternal.OPERATOR && !input.profile)
      throw new Error('Faltando informação de perfil para usuário operador.');

    if (input.role === userAuthenticated.role)
      throw new Error(
        'Operação não autorizada: não é possível criar um usuário com o mesmo papel do autenticado.',
      );

    const existingCpf = await this.usersRepository.findByCpf(input.cpf);
    if (existingCpf) throw new Error('CPF já cadastrado no sistema.');

    const existingUser = await this.usersRepository.findByEmail(input.email);
    if (existingUser) throw new Error('Usuário já existe.');
  }
}
