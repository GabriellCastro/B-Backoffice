import { IEncrypterProvider } from 'src/@core/application/gateways/providers/encrypter/encrypter.provider.interface';
import { ITokenAuthenticationProvider } from 'src/@core/application/gateways/providers/token/token.provider.interface';
import { IUserRepository } from 'src/@core/application/gateways/repositories/user.repository';

import { IAuthenticateUserDto } from './authenticate-user.dto';

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: IUserRepository,
    private encrypterProvider: IEncrypterProvider,
    private tokenAuthenticationProvider: ITokenAuthenticationProvider,
  ) {}

  async execute({ email, password }: IAuthenticateUserDto) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new Error('Email ou senha incorreta.');

    const comparePassword = await this.encrypterProvider.compare(
      password,
      user.password,
    );

    if (!comparePassword) throw new Error('Email ou senha incorreta.');

    const payload = {
      id: `${user.id}`,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const access_token = this.tokenAuthenticationProvider.generateToken({
      payload,
      secret: process.env.JWT_SECRET,
      expiresIn: '3h',
    });

    return {
      access_token,
      user: payload,
    };
  }
}
