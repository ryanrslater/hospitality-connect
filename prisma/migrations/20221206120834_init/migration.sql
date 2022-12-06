-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ADMIN', 'VENDOR', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACCOUNTCREATION', 'PENDING', 'ACTIVE', 'BANNED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ConnectionRequest" AS ENUM ('DENIED', 'ACCEPTED', 'PENDING');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "accountId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "bio" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "paymentCustomerId" VARCHAR(225) NOT NULL,
    "email" VARCHAR(225) NOT NULL,
    "ABN" VARCHAR(225) NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACCOUNTCREATION',
    "slug" VARCHAR(225) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "suppierRequest" "ConnectionRequest" NOT NULL DEFAULT 'PENDING',
    "vendorReqeust" "ConnectionRequest" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" VARCHAR(225) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_slug_key" ON "Account"("slug");

-- CreateIndex
CREATE INDEX "Account_accountId_slug_idx" ON "Account"("accountId", "slug");

-- CreateIndex
CREATE INDEX "Connection_vendorId_supplierId_idx" ON "Connection"("vendorId", "supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
