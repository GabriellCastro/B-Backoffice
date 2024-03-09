import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  MaxLength,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  Validate,
  IsMobilePhone,
} from 'class-validator';
import { OperatorProfile } from 'src/@core/shared/models/user.model';
import { RoleInternal } from 'src/@core/shared/models/user.model';
import { AddressDto } from 'src/app/common/dto/address';
import { CoordinatesDto } from 'src/app/common/dto/coordinates';
import { IsCPFConstraint } from 'src/app/common/validators/cpf';
import { IsFullNameConstraint } from 'src/app/common/validators/fullName';

export class UpdateUserControllerDto {
  @ApiProperty({
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    minimum: 3,
    maximum: 47,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(47)
  @Validate(IsFullNameConstraint)
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Validate(IsCPFConstraint)
  cpf?: string;

  @ApiProperty({
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsMobilePhone('pt-BR')
  @IsOptional()
  whatsApp?: string;

  @ApiProperty({
    minimum: 6,
    maximum: 30,
    required: false,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({
    enum: RoleInternal,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: RoleInternal;

  @ApiProperty({
    enum: OperatorProfile,
  })
  @IsEnum(OperatorProfile)
  @IsOptional()
  profile?: OperatorProfile;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;
}
