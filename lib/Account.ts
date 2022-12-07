import { PrismaClient, Prisma, AccountType, Account as acc } from "@prisma/client";

export class Account {

    private prisma = new PrismaClient()

    async create(username: string, sub: string, email: string): Promise<acc> {
        const data: Prisma.AccountCreateInput = {
            accountId: sub,
            name: "",
            username: username,
            bio: "",
            profileImage: "",
            coverImage: "",
            paymentCustomerId: "",
            email,
            ABN: "",
            accountType: AccountType.UNKNOWN,
            slug: sub
        }
        const user = await this.prisma.account.create({
            data
        })
        return user
    }
}