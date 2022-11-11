import { PrismaClient, Account } from '@prisma/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import type { NextApiRequest, NextApiResponse } from 'next'

export class Auth {

    private prisma = new PrismaClient()

    async authenticateUser(req: NextApiRequest, res: NextApiResponse): Promise<Account> {
        const session = await unstable_getServerSession(req, res, authOptions)
        if (session) {

            const account: Account | null = await this.prisma.account.findFirst({
                where: {
                    email: session.user?.email?.toString()
                }
            })

            if (!account) throw Error('uh ok')

            return account

        } else {
            throw Error('uh ok')
        }
    }
}