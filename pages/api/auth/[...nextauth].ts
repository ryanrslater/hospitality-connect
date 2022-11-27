import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { User } from "next-auth"
import { Auth } from "../../../lib/Auth"
import type { NextAuthOptions } from 'next-auth'
import { ChallengeResponse, ChallengeResponseType } from "@aws-sdk/client-cognito-identity-provider"
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any> {
                const auth = new Auth()

                try {
                    const authenticateUser = await auth.signIn(credentials)
                    const user = await auth.getUser(authenticateUser.AuthenticationResult?.AccessToken)
                    return user
                } catch (err: any) {
                    console.log(err)
                    return {
                        id: credentials?.username,
                        error: err.name
                    }
                }
            }
        })
    ]
}

export default NextAuth(authOptions);