import { IUserAuthenticated } from '../create/create-user.dto';

export interface IListUserUseCaseDto {
  userAuthenticated: IUserAuthenticated;
  page?: number;
  perPage?: number;
  paginated?: boolean;
}
