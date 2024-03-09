import { IMailerProvider } from 'src/@core/application/gateways/providers/mailer/mailer.provider.interface';
import { ITokenAuthenticationProvider } from 'src/@core/application/gateways/providers/token/token.provider.interface';
import { IUserRepository } from 'src/@core/application/gateways/repositories/user.repository';
import { IUserModel, RoleInternal } from 'src/@core/shared/models/user.model';

import { IForgotPasswordUserUseCaseDto } from './forgot-password-user.dto';

export class ForgotPasswordUserUseCase {
  constructor(
    private usersRepository: IUserRepository,
    private tokenAuthenticationProvider: ITokenAuthenticationProvider,
  ) {}

  async execute(
    { email }: IForgotPasswordUserUseCaseDto,
    mailerService: IMailerProvider,
  ): Promise<void> {
    const userFound = await this.validateForgotPassword({ email });

    const token = this.tokenAuthenticationProvider.generateToken({
      payload: {
        id: `${userFound.id}`,
        email: userFound.email,
      },
      secret: process.env.JWT_SECRET,
      expiresIn: 15 * 60, // 15 minutes
    });

    await this.usersRepository.update({
      id: userFound.id,
      passwordReset: token,
    } as unknown as IUserModel);

    const url = `${process.env.EMAIL_PASSWORD_RECOVERY_URL_REDIRECT}?token=${token}`;

    try {
      await mailerService.sendMail({
        to: email,
        from: `"No Reply" <${process.env.MAIL_FROM}>`,
        subject: 'Gestão - Recuperação de senha',
        template: './passwordChangeRequest',
        context: {
          url,
          username: userFound.name,
          email: userFound.email,
        },
      });
    } catch {
      throw new Error('Falha ao enviar email.');
    }
  }

  private async validateForgotPassword({
    email,
  }: IForgotPasswordUserUseCaseDto) {
    const userFound = await this.usersRepository.findByEmail(email);
    if (!userFound) throw new Error('Usuário não encontrado.');

    const allowedRoles = [RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER];
    if (!allowedRoles.includes(userFound.role))
      throw new Error('Operação não autorizada.');

    if (!userFound.activated)
      throw new Error(
        'Operação não autorizada: usuário deve estar ativado, confirme seu email para ativar sua conta.',
      );

    return userFound;
  }
}
