import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordUserControllerDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
