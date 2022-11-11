import { PrismaClient, Account } from '@prisma/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import type { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()

export class Auth {
    async authenticateUser(req: NextApiRequest, res: NextApiResponse): Promise<Account> {
        const session = await unstable_getServerSession(req, res, authOptions)
        if (session) {
            const prisma = new PrismaClient()
            const account: Account | null = await prisma.account.findFirst({
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