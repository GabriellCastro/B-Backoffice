import { PrismaClient } from '@prisma/client';
import { IUserRepository } from 'src/@core/application/gateways/repositories/user.repository';
import { IUserModel, RoleInternal } from 'src/@core/shared/models/user.model';
import {
  IFindAllInput,
  IIncludeRelations,
  IPaginatedResponse,
} from 'src/@core/shared/repository/repository.interface';

export class UserRepository implements IUserRepository {
  prisma = new PrismaClient();

  async create(input: IUserModel): Promise<void> {
    try {
      await this.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: input.password,
          whatsApp: input.whatsApp,
          cpf: input.cpf,
          emailVerify: input.emailVerify,
          address: {
            create: input.address,
          },
          coordinates: {
            create: input.coordinates,
          },
          role: input.role,
          profile: input.profile,
        },
      });
    } catch (error) {
      throw new Error(error.meta.cause);
    }
  }

  async update(input: IUserModel): Promise<void> {
    try {
      await this.prisma.user.update({
        data: {
          email: input.email,
          name: input.name,
          activated: input.activated,
          whatsApp: input.whatsApp,
          cpf: input.cpf,
          password: input.password,
          emailVerify: input.emailVerify,
          passwordReset: input.passwordReset,
          address: {
            update: input.address,
          },
          coordinates: {
            update: input.coordinates,
          },
          role: input.role,
          profile: input.profile,
        },
        where: {
          id: input.id,
        },
        include: {
          address: true,
          coordinates: true,
        },
      });
    } catch (error) {
      throw new Error(error.meta.cause);
    }
  }

  async confirmEmail(token: string): Promise<IUserModel | null> {
    try {
      const userUpdated = await this.prisma.user.update({
        data: {
          activated: true,
          emailVerify: null,
        },
        where: {
          emailVerify: token,
        },
      });
      return userUpdated as IUserModel;
    } catch {
      return null;
    }
  }

  async find(
    id: string,
    include?: IIncludeRelations,
  ): Promise<IUserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: include,
      });
      return user as IUserModel;
    } catch (error) {
      throw new Error(error.meta.cause);
    }
  }

  async findAll(
    { page = 0, perPage = 10, paginated, userAuthenticated }: IFindAllInput,
    include?: IIncludeRelations,
  ): Promise<IPaginatedResponse<Omit<IUserModel, 'password'>> | null> {
    const users = await this.prisma.user.findMany({ include: include });

    const usersFiltered = users.filter((element) => {
      delete element.password;
      delete element.emailVerify;
      delete element.passwordReset;
      return ![RoleInternal.ADMINISTRATOR, userAuthenticated.role].includes(
        element.role as RoleInternal,
      );
    });

    const total = usersFiltered.length;
    let totalPages = Math.ceil(total / 10);

    if (!paginated) {
      const response: IPaginatedResponse<Omit<IUserModel, 'password'>> = {
        elements: usersFiltered as Omit<IUserModel, 'password'>[],
        totalElements: total,
        currentPage: null,
        firstPage: null,
        lastPage: null,
        perPage: null,
      };

      return response;
    }

    const paginatedUser = usersFiltered.slice(
      page * perPage,
      page * perPage + perPage,
    );

    if (totalPages - 1 < 1) totalPages = 1;
    if (page > totalPages) throw new Error('Página não existe.');

    const response: IPaginatedResponse<Omit<IUserModel, 'password'>> = {
      elements: paginatedUser as Omit<IUserModel, 'password'>[],
      totalElements: total,
      currentPage: Number(page),
      firstPage: Number(page) === 0,
      lastPage: Number(page) === totalPages,
      perPage: Number(perPage),
    };

    return response;
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user as IUserModel;
    } catch (error) {
      throw new Error(error.meta.cause);
    }
  }

  async findByCpf(cpf: string): Promise<IUserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          cpf,
        },
      });

      return user as IUserModel | null;
    } catch (error) {
      throw new Error(error.meta.cause);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.coordinates.delete({
        where: {
          userId: id,
        },
      });

      await this.prisma.address.delete({
        where: {
          userId: id,
        },
      });

      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(error.meta.cause);
    }
  }
}
