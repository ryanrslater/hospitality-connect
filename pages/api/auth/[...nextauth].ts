import NextAuth, {NextAuthOptions} from "next-auth"
import CognitoProvider from "next-auth/providers/cognito";

const {COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_ISSUER} = process.env

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CognitoProvider({
        clientId: COGNITO_CLIENT_ID ? COGNITO_CLIENT_ID : "",
        clientSecret: COGNITO_CLIENT_SECRET ? COGNITO_CLIENT_SECRET : '',
        issuer: COGNITO_ISSUER,
      })
    // ...add more providers here
  ]
}


export default NextAuth(authOptions)