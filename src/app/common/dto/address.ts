import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { IAddress } from 'src/@core/shared/models/user.model';

export class AddressDto implements IAddress {
  @ApiProperty()
  @IsString()
  @Matches(/^[0-9]{5}-[0-9]{3}$/)
  cep: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;
}
