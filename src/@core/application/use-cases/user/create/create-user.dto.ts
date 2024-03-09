import {
  IAddress,
  RoleInternal,
  OperatorProfile,
  ICoordinates,
} from 'src/@core/shared/models/user.model';

export interface ICreateUserUseCaseInput {
  name: string;
  email: string;
  password: string;
  whatsApp: string;
  cpf: string;
  address: IAddress;
  role: RoleInternal;
  profile?: OperatorProfile;
  coordinates?: ICoordinates;
}

export interface IUserAuthenticated {
  id: string;
  name: string;
  email: string;
  role: RoleInternal;
}

export interface ICreateUserUseCaseDto {
  input: ICreateUserUseCaseInput;
  userAuthenticated: IUserAuthenticated;
}
