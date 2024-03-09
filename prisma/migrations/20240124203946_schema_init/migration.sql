-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRATOR', 'MANAGER', 'OPERATOR', 'CLIENT');

-- CreateEnum
CREATE TYPE "OperatorProfile" AS ENUM ('OP_RETRO', 'OP_EXCAVATOR', 'OP_ROLO', 'OP_MOTORLEVELER', 'DUMP_TRUCK_DRIVER', 'LARGE_DUMP_TRUCK_DRIVER', 'PLATFORM_TRUCK_DRIVER');

-- CreateEnum
CREATE TYPE "LocationTypes" AS ENUM ('LINDEIRO', 'HOTEL', 'GUESTHOUSE', 'CRUSHING', 'QUARRY', 'MUNICIPAL_DEPOSIT', 'HORTO_DEPOSIT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "whatsApp" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OPERATOR',
    "profile" "OperatorProfile",
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "emailVerify" TEXT,
    "passwordReset" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "cep" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "complement" TEXT,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerify_key" ON "User"("emailVerify");

-- CreateIndex
CREATE UNIQUE INDEX "Address_id_key" ON "Address"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
