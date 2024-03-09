export enum RoleInternal {
  ADMINISTRATOR = 'ADMINISTRATOR',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  CLIENT = 'CLIENT',
}

export enum OperatorProfile {
  OP_RETRO = 'OP_RETRO',
  OP_EXCAVATOR = 'OP_EXCAVATOR',
  OP_ROLO = 'OP_ROLO',
  OP_MOTORLEVELER = 'OP_MOTORLEVELER',
  DUMP_TRUCK_DRIVER = 'DUMP_TRUCK_DRIVER',
  LARGE_DUMP_TRUCK_DRIVER = 'LARGE_DUMP_TRUCK_DRIVER',
  PLATFORM_TRUCK_DRIVER = 'PLATFORM_TRUCK_DRIVER',
}

export interface IAddress {
  cep: string;
  address: string;
  complement?: string;
  street: string;
  number: string;
  city: string;
  state: string;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IUserModel {
  id?: string;
  name: string;
  email: string;
  whatsApp: string;
  cpf: string;
  password: string;
  address?: IAddress;
  activated?: boolean;
  emailVerify?: string;
  passwordReset?: string;
  role: RoleInternal;
  profile?: OperatorProfile;
  coordinates?: ICoordinates;
  createdAt?: Date;
  updaetdAt?: Date;
}
