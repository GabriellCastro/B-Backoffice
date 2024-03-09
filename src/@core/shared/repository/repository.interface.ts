import { IUserModel } from '../models/user.model';

export interface IIncludeRelations {
  [x: string]: boolean;
}

export interface IPaginatedResponse<T> {
  elements: T[] | null;
  totalElements?: number;
  firstPage?: boolean;
  lastPage?: boolean;
  currentPage?: number;
  perPage?: number;
}

export interface IFindAllInput {
  perPage?: number;
  page?: number;
  paginated?: boolean;
  userAuthenticated?: IUserModel;
}

export interface IRepository<T> {
  create(input: T): Promise<void>;
  update(input: T, include?: IIncludeRelations): Promise<void>;
  find(id: string, include?: IIncludeRelations): Promise<T | null>;
  findAll(
    input: IFindAllInput,
    include?: IIncludeRelations,
  ): Promise<IPaginatedResponse<any> | null>;
  delete(id: string): Promise<void>;
}
