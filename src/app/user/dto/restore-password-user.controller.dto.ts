import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RestorePasswordControllerDto {
  @ApiProperty({
    minimum: 6,
    maximum: 30,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  password: string;
}
