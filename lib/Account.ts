import { PrismaClient, Prisma, AccountType, Account as acc, AccountStatus } from "@prisma/client";

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
            slug: sub
        }
        const user = await this.prisma.account.create({
            data
        })
        return user
    }

    async updateStatus(sub: string, status: AccountStatus) {
    
        const values: Prisma.AccountUpdateArgs = {
            data: {
                accountStatus: status
            },
            where: {
                accountId: sub,
            }
        }
        const user = await this.prisma.account.update(values)
        return user
    }
}