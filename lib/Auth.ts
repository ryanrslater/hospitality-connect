import { PrismaClient, Account, Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from "next-auth"
import { AuthFlowType, CognitoIdentityProvider, InitiateAuthCommandInput, SignUpCommandInput, SignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
export class Auth {

    private prisma = new PrismaClient()

    private region = 'ap-southeast-2'

    private client = new CognitoIdentityProvider({ region: this.region })

    private clientId = process.env.COGNITO_CLIENT_ID

    async signIn(credentials: Record<"username" | "password", string> | undefined): Promise<User> {

        if (!credentials) throw Error('uh ok')



        const req: InitiateAuthCommandInput = {
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: credentials.username,
                PASSWORD: credentials.password
            }
        }

        await this.client.initiateAuth(req)

        const prisma = new PrismaClient()

        const db = await prisma.account.findFirst({
            where: {
                email: credentials.username
            }
        })

        if (!db) throw Error()

        const user: User = {
            id: db.email,
            name: db.name,
            email: db.email,
            image: db.profileImage

        }
        return user
    }

    async signUp(account: Prisma.AccountCreateInput, password: string | undefined, confirmPassword: string | undefined) {
        if (!password) throw Error('')
        if (!confirmPassword) throw Error('')
        if (password !== confirmPassword) throw Error('')

        const req: SignUpCommandInput = {
            ClientId: this.clientId,
            Username: account.accountId,
            Password: password
        }

        const cognito = this.client.signUp(req)


    }

    async authenticate(req: NextApiRequest, res: NextApiResponse): Promise<Account> {
        const session = await unstable_getServerSession(req, res, authOptions)

        if (!session || !session.user) throw Error()

        if (!session.user.email) throw Error()

        const prisma = new PrismaClient()

        const db = await prisma.account.findFirst({
            where: {
                email: session.user.email
            }
        })
        if (!db) throw Error()

        return db
    }
}