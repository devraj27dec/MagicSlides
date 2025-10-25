import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    // access_type: "offline",
                    // response_type: "code",
                    scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
                },
            },
            profile(profile) {
                console.log("profile", profile);
                const data = {
                    id: profile.sub,
                    fname : profile.given_name,
                    lname: profile.family_name,
                    email: profile.email,
                    picture: profile.picture,
                }
                return data;
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            // On first sign-in, store access & refresh token in JWT
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
            }
            return token;
        },
        async session({ session, token }) {
            // Make access token available in session
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (session as any).accessToken = token.accessToken;
            return session;
        },
    },

}