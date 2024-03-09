import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  MaxLength,
  IsNotEmpty,
  ValidateNested,
  Validate,
  IsMobilePhone,
  ValidateIf,
} from 'class-validator';
import { OperatorProfile } from 'src/@core/shared/models/user.model';
import { RoleInternal } from 'src/@core/shared/models/user.model';
import { AddressDto } from 'src/app/common/dto/address';
import { CoordinatesDto } from 'src/app/common/dto/coordinates';
import { IsCPFConstraint } from 'src/app/common/validators/cpf';
import { IsFullNameConstraint } from 'src/app/common/validators/fullName';

export class CreateUserControllerDto {
  @ApiProperty({
    minimum: 3,
    maximum: 47,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(47)
  @Validate(IsFullNameConstraint)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Validate(IsCPFConstraint)
  cpf: string;

  @ApiProperty()
  @IsMobilePhone('pt-BR')
  whatsApp: string;

  @ApiProperty({
    minimum: 6,
    maximum: 30,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({
    enum: RoleInternal,
  })
  @IsEnum(Role)
  role: RoleInternal;

  @ApiProperty({
    enum: OperatorProfile,
  })
  @IsEnum(OperatorProfile)
  @ValidateIf((field) => field.role === RoleInternal.OPERATOR)
  @IsNotEmpty()
  profile: OperatorProfile;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;
}
