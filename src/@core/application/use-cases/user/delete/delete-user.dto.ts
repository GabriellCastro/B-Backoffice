import { IUserAuthenticated } from '../create/create-user.dto';

export interface IDeleteUserUseCaseDto {
  userAuthenticated: IUserAuthenticated;
  idTarget: string;
}
