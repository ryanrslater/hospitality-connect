import { PrismaClient, Account } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from "next-auth"
import { AuthFlowType, CognitoIdentityProvider, InitiateAuthCommandInput, InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider'


export class Auth {

    private prisma = new PrismaClient()

    private region = 'ap-southeast-2'
    private client = new CognitoIdentityProvider({ region: this.region })

    async signIn(credentials: Record<"username" | "password", string> | undefined): Promise<User> {

        if (!credentials) throw Error('uh ok')



        const req: InitiateAuthCommandInput = {
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: credentials.username,
                PASSWORD: credentials.password
            }
        }

        const cognito = await this.client.initiateAuth(req)

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
}