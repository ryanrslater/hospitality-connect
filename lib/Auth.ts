import { User } from "next-auth"
import { unstable_getServerSession } from "next-auth/next"
import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { PrismaClient, Account, Prisma } from '@prisma/client'

import {
    AuthFlowType,
    CognitoIdentityProvider,
    InitiateAuthCommandInput,
    SignUpCommandInput,
    ConfirmSignUpRequest,
    ConfirmSignUpCommandOutput, CognitoIdentityProviderClientConfig
} from '@aws-sdk/client-cognito-identity-provider'

export class Auth {

    private prisma = new PrismaClient()

    private region = 'ap-southeast-2'

    private client;

    private clientId = process.env.COGNITO_CLIENT_ID

    constructor() {
        if (!process.env.ACCESS_KEY_ID) throw Error()
        if (!process.env.SECRET_ACCESS_KEY) throw Error()

        this.client = new CognitoIdentityProvider({
            region: this.region, credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY
            }
        })
    }

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

        const db = await this.prisma.account.findFirst({
            where: {
                username: credentials.username
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

    async signUp(data: Account, password: string | undefined, confirmPassword: string | undefined) {
        if (!password) throw Error('')
        if (!confirmPassword) throw Error('')
        if (password !== confirmPassword) throw Error('')

        const req: SignUpCommandInput = {
            ClientId: this.clientId,
            Username: data.accountId,
            Password: password
        }

        const cognito = await this.client.signUp(req).then(res => res)

        if (!cognito.UserSub) throw Error()

        const style: Prisma.PageStyleCreateWithoutAccountInput = {
            name: "",
            navbarColour: "",
            backgroundColour: "",
            accentColour: "",
            secondaryColour: "",
            cardColour: "",
         
        }

        const acc: Prisma.AccountCreateInput = {
            accountId: "",
            name: "",
            username: "",
            bio: "",
            profileImage: "",
            coverImage: "",
            paymentCustomerId: "",
            email: "",
            ABN: "",
            accountType: "ADMIN",
            accountStatus: "PENDING",
            slug: "",
            pageStyle: {
                create: style
            }
        }

        acc.accountId = cognito.UserSub
        const db = await this.prisma.account.create({
            data: acc
        })
        if (!db) throw Error()

        return db
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

    async confirmAccount(username: string, code: string): Promise<ConfirmSignUpCommandOutput> {
        const req: ConfirmSignUpRequest = {
            ClientId: this.clientId,
            Username: username,
            ConfirmationCode: code
        }

        const cognito = await this.client.confirmSignUp(req).then(res => res)

        if (!cognito) throw Error()

        return cognito
    }
}