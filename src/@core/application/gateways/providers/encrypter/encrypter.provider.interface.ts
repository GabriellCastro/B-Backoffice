export interface IEncrypterProvider {
  compare(password: string, userPassword: string): Promise<boolean>;
  hash(password: string, salt: number): Promise<string>;
}
