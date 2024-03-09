import { compare, hash } from 'bcrypt';
import { IEncrypterProvider } from 'src/@core/application/gateways/providers/encrypter/encrypter.provider.interface';

export class EncrypterProvider implements IEncrypterProvider {
  public async compare(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return compare(password, userPassword);
  }

  hash(password: string, salt: number): Promise<string> {
    return hash(password, salt);
  }
}
