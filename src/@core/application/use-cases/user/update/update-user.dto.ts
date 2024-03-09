import {
  IAddress,
  OperatorProfile,
  RoleInternal,
  ICoordinates,
} from 'src/@core/shared/models/user.model';

import { IUserAuthenticated } from '../create/create-user.dto';

export interface IUpdateUserUseCaseInput {
  id: string;
  name?: string;
  email?: string;
  whatsApp?: string;
  cpf?: string;
  address?: IAddress;
  password?: string;
  role?: RoleInternal;
  profile?: OperatorProfile;
  coordinates?: ICoordinates;
}

export interface IUpdateUserUseCaseDto {
  input: IUpdateUserUseCaseInput;
  userAuthenticated: IUserAuthenticated;
}
