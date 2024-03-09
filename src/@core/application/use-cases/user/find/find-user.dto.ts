import { IUserAuthenticated } from '../create/create-user.dto';

export interface IFindUserUseCaseDto {
  userAuthenticated: IUserAuthenticated;
  idTarget: string;
}
