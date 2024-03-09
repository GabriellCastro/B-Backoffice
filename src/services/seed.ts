import * as bcrypt from 'bcrypt';
import { ICreateUserUseCaseInput } from 'src/@core/application/use-cases/user/create/create-user.dto';

import { PrismaService } from './database/prisma.service';

const prisma = new PrismaService();

enum RoleInternal {
  ADMINISTRATOR = 'ADMINISTRATOR',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  CLIENT = 'CLIENT',
}

async function main() {
  const createUser = async (data: ICreateUserUseCaseInput) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        address: {
          create: data.address,
        },
        coordinates: {
          create: data.coordinates,
        },
      },
    });
    return user;
  };

  await createUser({
    name: 'Admin',
    email: 'admin@gmail.com',
    password: '12345678',
    whatsApp: '(92) 99999-9999',
    cpf: '931.589.700-58',
    address: {
      street: 'Rua 1',
      number: '1',
      address: 'Bairro 1',
      city: 'Manaus',
      state: 'AM',
      cep: '69000-000',
      complement: 'Complemento 1',
    },
    role: RoleInternal.ADMINISTRATOR,
  });

  console.log(`===== Users created! ======`);
  console.table({
    login: 'admin@gmail.com',
    password: '12345678',
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
