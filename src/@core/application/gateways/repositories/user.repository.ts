import { IUserModel } from 'src/@core/shared/models/user.model';
import { IRepository } from 'src/@core/shared/repository/repository.interface';

export interface IEmailVerifyUpdate {
  token: string;
}

export interface IUserRepository extends IRepository<IUserModel> {
  findByEmail(email: string): Promise<IUserModel | null>;
  confirmEmail(token: string): Promise<IUserModel | null>;
  findByCpf(cpf: string): Promise<IUserModel | null>;
}
