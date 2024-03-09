import { MailerService } from '@nestjs-modules/mailer';
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpException,
  UseFilters,
  UseGuards,
  Get,
  Req,
  Query,
  Param,
  Delete,
  HttpCode,
  Patch,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticateUserUseCase } from 'src/@core/application/use-cases/user/authenticate/authenticate-user.usecase';
import { ConfirmEmailUserUseCase } from 'src/@core/application/use-cases/user/confirmEmail/confirm-email-user.usecase';
import { CreateUserUseCase } from 'src/@core/application/use-cases/user/create/create-user.usecase';
import { DeleteUserUseCase } from 'src/@core/application/use-cases/user/delete/delete-user.usecase';
import { FindUserUseCase } from 'src/@core/application/use-cases/user/find/find-user.usecase';
import { ForgotPasswordUserUseCase } from 'src/@core/application/use-cases/user/forgot-password/forgot-password-user.usecase';
import { ListUserUseCase } from 'src/@core/application/use-cases/user/list/list-user.usecase';
import { RestorePasswordUserUseCase } from 'src/@core/application/use-cases/user/restore-password/restore-password-user.usecase';
import { UpdateUserUseCase } from 'src/@core/application/use-cases/user/update/update-user.usecase';
import { RoleInternal } from 'src/@core/shared/models/user.model';
import { HttpExceptionFilter } from 'src/filters/http/http-exception.filter';
import { ResponseInterceptor } from 'src/interceptors/response/response.interceptor';
import { ClientesService } from 'src/services/cliente/ClientesService';

import { FindOneParams } from '../common/dto/findParams';
import { AuthGuardFactory } from '../common/guards/auth/auth.guard.factory';
import { Roles, RolesGuard } from '../common/guards/roles/roles.guard';
import { AuthenticateUserControllerDto } from './dto/authenticate-user.controller.dto';
import { CreateUserControllerDto } from './dto/create-user.controller.dto';
import { ForgotPasswordUserControllerDto } from './dto/forgot-password-user.controller.do';
import { RestorePasswordControllerDto } from './dto/restore-password-user.controller.dto';
import { UpdateUserControllerDto } from './dto/update-user.controller.dto';

@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('user')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private listUserUseCase: ListUserUseCase,
    private findUserUseCase: FindUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private confirmEmailUserUseCase: ConfirmEmailUserUseCase,
    private forgotPasswordUserUseCase: ForgotPasswordUserUseCase,
    private restorePasswordUserUseCase: RestorePasswordUserUseCase,
    private mailerService: MailerService,
    private clientesService: ClientesService,
  ) {}

  @ApiTags('user')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect credentials',
  })
  @Get('/calculate-route')
  async calculateRoute() {
    try {
      // Obtém as coordenadas dos clientes do banco de dados usando Prisma
      const coordenadasClientes =
        await this.clientesService.obterCoordenadasClientes();

      // Calcula a rota otimizada
      const ordemVisita =
        await this.clientesService.calcularRotaOtimizada(coordenadasClientes);

      return ordemVisita;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiBearerAuth()
  @ApiBody({
    required: true,
    type: CreateUserControllerDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 204,
    description: 'User created',
  })
  @ApiOperation({
    summary: 'Create a user.',
  })
  @Roles([RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER])
  @UseGuards(AuthGuardFactory.create(), RolesGuard)
  @Post()
  @HttpCode(204)
  async create(@Body() createUserDto: CreateUserControllerDto, @Req() request) {
    try {
      await this.createUserUseCase.execute(
        {
          input: createUserDto,
          userAuthenticated: request.user,
        },
        this.mailerService,
      );
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserControllerDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 204,
    description: 'User updated',
  })
  @ApiOperation({
    summary: 'Update a user.',
  })
  @Roles([RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER])
  @UseGuards(AuthGuardFactory.create(), RolesGuard)
  @Put()
  @HttpCode(204)
  async update(@Body() updateUserDto: UpdateUserControllerDto, @Req() request) {
    try {
      await this.updateUserUseCase.execute({
        input: updateUserDto,
        userAuthenticated: request.user,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiResponse({
    status: 204,
    description: 'Email confirmed.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or unknown.',
  })
  @ApiOperation({
    summary: 'Confirm email.',
  })
  @ApiQuery({
    required: true,
    name: 'token',
  })
  @Patch('/confirmEmail')
  @HttpCode(204)
  async confirmEmail(@Query('token') token) {
    try {
      await this.confirmEmailUserUseCase.execute({
        token,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiResponse({
    status: 204,
    description: 'Email to recovery password sended.',
  })
  @ApiResponse({
    status: 400,
    description: 'Email not registered.',
  })
  @ApiOperation({
    summary: 'Forgot password.',
  })
  @ApiBody({
    type: ForgotPasswordUserControllerDto,
  })
  @Post('/forgotPassword')
  @HttpCode(204)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordUserControllerDto,
  ) {
    try {
      await this.forgotPasswordUserUseCase.execute(
        forgotPasswordDto,
        this.mailerService,
      );
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiResponse({
    status: 204,
    description: 'Password changed.',
  })
  @ApiResponse({
    status: 400,
    description: 'Token invalid.',
  })
  @ApiOperation({
    summary: 'Restore password.',
  })
  @ApiBody({
    type: RestorePasswordControllerDto,
  })
  @ApiQuery({
    required: true,
    name: 'token',
  })
  @Patch('/restorePassword')
  @HttpCode(204)
  async restorePassword(
    @Body() restorePassword: RestorePasswordControllerDto,
    @Query('token') token,
  ) {
    try {
      await this.restorePasswordUserUseCase.execute({
        password: restorePassword.password,
        token,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Listed.',
  })
  @ApiQuery({
    required: false,
    name: 'page',
    example: 0,
  })
  @ApiQuery({
    required: false,
    name: 'per_page',
    example: 10,
  })
  @ApiOperation({
    summary: 'List all users.',
  })
  @Roles([RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER])
  @UseGuards(AuthGuardFactory.create(), RolesGuard)
  @Get()
  async list(@Query('page') page, @Query('per_page') perPage, @Req() request) {
    try {
      return await this.listUserUseCase.execute({
        userAuthenticated: request.user,
        page,
        perPage,
        paginated:
          !!page || Number(page) === 0 || !!perPage || Number(perPage) === 0
            ? true
            : false,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Found.',
  })
  @ApiParam({
    required: true,
    name: 'id',
  })
  @ApiOperation({
    summary: 'Find a user.',
  })
  @Roles([RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER])
  @UseGuards(AuthGuardFactory.create(), RolesGuard)
  @Get('/find/:id')
  async find(@Param() params: FindOneParams, @Req() request) {
    try {
      return await this.findUserUseCase.execute({
        userAuthenticated: request.user,
        idTarget: params.id,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 204,
    description: 'Deleted.',
  })
  @ApiParam({
    required: true,
    name: 'id',
  })
  @ApiOperation({
    summary: 'Delete a user.',
  })
  @Roles([RoleInternal.ADMINISTRATOR, RoleInternal.MANAGER])
  @UseGuards(AuthGuardFactory.create(), RolesGuard)
  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param() params: FindOneParams, @Req() request) {
    try {
      await this.deleteUserUseCase.execute({
        userAuthenticated: request.user,
        idTarget: params.id,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect credentials',
  })
  @ApiBody({
    required: true,
    type: AuthenticateUserControllerDto,
  })
  @ApiOperation({
    summary: 'Authenticate.',
  })
  @Post('/login')
  async authenticate(
    @Body() authenticateUserDto: AuthenticateUserControllerDto,
  ) {
    try {
      return await this.authenticateUserUseCase.execute(authenticateUserDto);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @ApiTags('user')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOperation({
    summary: 'Verify authentication.',
  })
  @UseGuards(AuthGuardFactory.create())
  @Get('/verify')
  async verifyAuthentication(@Req() request) {
    return request.user;
  }
}
