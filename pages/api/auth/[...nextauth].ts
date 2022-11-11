import NextAuth, {NextAuthOptions} from "next-auth"
import CognitoProvider from "next-auth/providers/cognito";
import { PrismaClient, Account } from '@prisma/client'
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CognitoProvider({
        clientId: process.env.COGNITO_CLIENT_ID,
        clientSecret: process.env.COGNITO_CLIENT_SECRET,
        issuer: process.env.COGNITO_ISSUER,
      })
    // ...add more providers here
  ]
}


export default NextAuth(authOptions)