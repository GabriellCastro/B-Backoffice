import { Module } from '@nestjs/common';
import { AuthenticateUserUseCase } from 'src/@core/application/use-cases/user/authenticate/authenticate-user.usecase';
import { AuthenticateUserUseCaseFactory } from 'src/@core/application/use-cases/user/authenticate/authenticate-user.usecase.factory';
import { ConfirmEmailUserUseCase } from 'src/@core/application/use-cases/user/confirmEmail/confirm-email-user.usecase';
import { ConfirmEmailUserUseCaseFactory } from 'src/@core/application/use-cases/user/confirmEmail/confirm-email-user.usecase.factory';
import { CreateUserUseCase } from 'src/@core/application/use-cases/user/create/create-user.usecase';
import { CreateUserUseCaseFactory } from 'src/@core/application/use-cases/user/create/create-user.usecase.factory';
import { DeleteUserUseCase } from 'src/@core/application/use-cases/user/delete/delete-user.usecase';
import { DeleteUserUseCaseFactory } from 'src/@core/application/use-cases/user/delete/delete-user.usecase.factory';
import { FindUserUseCase } from 'src/@core/application/use-cases/user/find/find-user.usecase';
import { FindUserUseCaseFactory } from 'src/@core/application/use-cases/user/find/find-user.usecase.factory';
import { ForgotPasswordUserUseCase } from 'src/@core/application/use-cases/user/forgot-password/forgot-password-user.usecase';
import { ForgotPasswordUserUseCaseFactory } from 'src/@core/application/use-cases/user/forgot-password/forgot-password-user.usecase.factory';
import { ListUserUseCase } from 'src/@core/application/use-cases/user/list/list-user.usecase';
import { ListUserUseCaseFactory } from 'src/@core/application/use-cases/user/list/list-user.usecase.factory';
import { RestorePasswordUserUseCase } from 'src/@core/application/use-cases/user/restore-password/restore-password-user.usecase';
import { RestorePasswordUserUseCaseFactory } from 'src/@core/application/use-cases/user/restore-password/restore-password-user.usecase.factory';
import { UpdateUserUseCase } from 'src/@core/application/use-cases/user/update/update-user.usecase';
import { UpdateUserUseCaseFactory } from 'src/@core/application/use-cases/user/update/update-user.usecase.factory';
import { ClientesService } from 'src/services/cliente/ClientesService';
import { PrismaService } from 'src/services/database/prisma.service';

import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [
    ClientesService,
    PrismaService,
    {
      provide: CreateUserUseCase,
      useFactory: () => {
        return CreateUserUseCaseFactory.create();
      },
    },
    {
      provide: AuthenticateUserUseCase,
      useFactory: () => {
        return AuthenticateUserUseCaseFactory.create();
      },
    },
    {
      provide: ListUserUseCase,
      useFactory: () => {
        return ListUserUseCaseFactory.create();
      },
    },
    {
      provide: FindUserUseCase,
      useFactory: () => {
        return FindUserUseCaseFactory.create();
      },
    },
    {
      provide: DeleteUserUseCase,
      useFactory: () => {
        return DeleteUserUseCaseFactory.create();
      },
    },
    {
      provide: UpdateUserUseCase,
      useFactory: () => {
        return UpdateUserUseCaseFactory.create();
      },
    },
    {
      provide: ConfirmEmailUserUseCase,
      useFactory: () => {
        return ConfirmEmailUserUseCaseFactory.create();
      },
    },
    {
      provide: ForgotPasswordUserUseCase,
      useFactory: () => {
        return ForgotPasswordUserUseCaseFactory.create();
      },
    },
    {
      provide: RestorePasswordUserUseCase,
      useFactory: () => {
        return RestorePasswordUserUseCaseFactory.create();
      },
    },
  ],
})
export class UserModule {}
