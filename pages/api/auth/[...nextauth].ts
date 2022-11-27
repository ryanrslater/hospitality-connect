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
                let authenticateUser
                try {
                    authenticateUser = await auth.signIn(credentials)
                } catch (err: any) {
                    return {
                        name: credentials?.username,
                        challenge: err.name
                    }

                }

                console.log("authenticateUser", authenticateUser)

                return authenticateUser
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            console.log("token", token)

            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account) {


            }
            return token
        }
    }
}

export default NextAuth(authOptions);