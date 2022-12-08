import type { NextApiRequest, NextApiResponse, GetServerSidePropsContext } from 'next'
import type { CookieSerializeOptions } from "cookie";
import cookie from "cookie";

import {
    AuthFlowType,
    CognitoIdentityProvider,
    InitiateAuthCommandInput,
    SignUpCommandInput,
    ConfirmSignUpRequest,
    InitiateAuthCommandOutput,
    ConfirmSignUpCommandOutput,
    GetUserCommandInput
} from '@aws-sdk/client-cognito-identity-provider'

type AuthRes = {
    sub: string | null;
    challenge: string | null;
    error: string | null
}

export class Auth {

    private region = 'ap-southeast-2'

    private client;

    private clientId = process.env.COGNITO_CLIENT_ID

    private tokenName = 'hospo-token'

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

    async signIn(username: string | undefined, password: string | undefined, res: NextApiResponse): Promise<AuthRes> {

        if (!username || !password) return { error: 'missing creds', sub: null, challenge: null }

        const request: InitiateAuthCommandInput = {
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password
            }
        }

        let auth: InitiateAuthCommandOutput

        try {
            auth = await this.client.initiateAuth(request)
        } catch (e: any) {
            if (e.code == "UserNotConfirmedException") return { error: null, sub: null, challenge: 'UserNotConfirmedException' }
            return { error: e.code, sub: null, challenge: null }
        }

        if (!auth.AuthenticationResult?.AccessToken || !auth.AuthenticationResult.ExpiresIn) return { error: "No token", sub: null, challenge: null }

        const date = new Date()

        const cookieOptions: CookieSerializeOptions = {
            expires: new Date(date.setSeconds(date.getSeconds() + auth.AuthenticationResult.ExpiresIn)),
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.VERCEL_ENV === 'production'
        }

        res.setHeader('Set-Cookie', cookie.serialize(this.tokenName, auth.AuthenticationResult.AccessToken, cookieOptions))

        const token: GetUserCommandInput = {
            AccessToken: auth.AuthenticationResult.AccessToken
        }

        const user = await this.client.getUser(token).then(res => res)

        const sub = user.UserAttributes?.find(e => e.Name == "sub")

        return {
            sub: sub?.Value || null, error: null, challenge: null
        }
    }

    async getUser(context: GetServerSidePropsContext): Promise<AuthRes | null> {
        const cookies = cookie.parse(context.req.headers.cookie || '');

        const name = cookies[this.tokenName];

        const token: GetUserCommandInput = {
            AccessToken: name
        }

        const user = await this.client.getUser(token).then(res => res)

        const sub = user.UserAttributes?.find(e => e.Name == "sub")
     
        return {
            sub: sub?.Value || null,
            error: null,
            challenge: null
        }
    }

    async signUp(username: string | undefined, email: string | undefined, password: string | undefined, confirmPassword: string | undefined): Promise<AuthRes> {
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

        return {
            sub: cognito.UserSub,
            error: null,
            challenge: 'UserNotConfirmedException'
        }
    }


    async confirmAccount(username: string | undefined, code: string | undefined ): Promise<ConfirmSignUpCommandOutput> {
        if (typeof username  != "string" || typeof code != "string") throw Error()
        
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