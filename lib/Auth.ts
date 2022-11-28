import { User } from "next-auth"
import session, { unstable_getServerSession } from "next-auth/next"
import type { NextApiRequest, NextApiResponse, GetServerSidePropsContext } from 'next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { PrismaClient, Account, Prisma } from '@prisma/client'

import {
    AuthFlowType,
    CognitoIdentityProvider,
    InitiateAuthCommandInput,
    SignUpCommandInput,
    ConfirmSignUpRequest,
    SignUpCommandOutput,
    InitiateAuthCommandOutput,
    ConfirmSignUpCommandOutput,
    GetUserCommandInput,
    GetUserCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'

export class Auth {

    private prisma = new PrismaClient()

    private region = 'ap-southeast-2'

    private client;

    private clientId = process.env.COGNITO_CLIENT_ID

    constructor() {
        if (!process.env.ACCESS_KEY_ID) throw Error('missing access key')
        if (!process.env.SECRET_ACCESS_KEY) throw Error('missing secret key')

        this.client = new CognitoIdentityProvider({
            region: this.region,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,

            }
        })
    }

    async signIn(credentials: Record<"username" | "password", string> | undefined): Promise<InitiateAuthCommandOutput> {

        if (!credentials) throw Error()
this.client.cr
        const req: InitiateAuthCommandInput = {
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: credentials.username,
                PASSWORD: credentials.password
            }
        }

        const auth: InitiateAuthCommandOutput = await this.client.initiateAuth(req)

        return auth
    }

    async getUser(AccessToken: string | undefined): Promise<User | null> {
        if (!AccessToken) return null

        const userReq: GetUserCommandInput = {
            AccessToken
        }

        const user: GetUserCommandOutput = await this.client.getUser(userReq)
        if (!user.UserAttributes) throw Error()
     
        if (!user.Username) return null

        const res: User = {
            id: user.Username,
        }

        return res
    }

    async signUp(username: string | undefined, email: string | undefined, password: string | undefined, confirmPassword: string | undefined): Promise<SignUpCommandOutput> {
        if (!username) throw Error('no username')
        if (!email) throw Error('no email')
        if (!password) throw Error('no password')
        if (!confirmPassword) throw Error('no confirm password')
        if (password !== confirmPassword) throw Error('passwords do not match')

        const req: SignUpCommandInput = {
            ClientId: this.clientId,
            UserAttributes: [
                {
                    "Name": "email",
                    "Value": email
                }
            ],
            Username: username,
            Password: password
        }

        const cognito = await this.client.signUp(req).then(res => res)

        if (!cognito.UserSub) throw Error()



        return cognito
    }

    async authenticate(req: GetServerSidePropsContext['req'], res: GetServerSidePropsContext['res']): Promise<typeof session> {
        const session = await unstable_getServerSession(req, res, authOptions)
     
        if (!session || !session.user) return null

        if (!session.user.email) return null


        return session
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