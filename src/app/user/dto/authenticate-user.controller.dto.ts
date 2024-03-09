import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { IAuthenticateUserDto } from 'src/@core/application/use-cases/user/authenticate/authenticate-user.dto';

export class AuthenticateUserControllerDto implements IAuthenticateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
