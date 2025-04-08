import type { NextAuthOptions } from "next-auth"
import LinkedInProvider from "next-auth/providers/linkedin"
import { generateRandomString } from "@/lib/utils"

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid profile email",
          // Add a random state parameter for CSRF protection
          state: generateRandomString(20),
        },
      },
      profile(profile) {
        try {
          console.log("LinkedIn profile data:", JSON.stringify(profile, null, 2))
          return {
            id: profile.sub || profile.id || "unknown",
            name:
              profile.name ||
              (profile.localizedFirstName && profile.localizedLastName
                ? `${profile.localizedFirstName} ${profile.localizedLastName}`
                : "LinkedIn User"),
            email: profile.email || null,
            image: profile.picture || null,
          }
        } catch (error) {
          console.error("Error processing LinkedIn profile:", error)
          // Return a basic profile to prevent errors
          return {
            id: "unknown",
            name: "LinkedIn User",
            email: null,
            image: null,
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      try {
        // Add user ID to session
        if (token.sub && session.user) {
          session.user.id = token.sub
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    },
    async jwt({ token, account, profile }) {
      try {
        // Persist the OAuth access_token and profile to the token
        if (account) {
          token.accessToken = account.access_token
          token.provider = account.provider
        }
        if (profile) {
          token.profileData = profile
        }
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        // Log redirect attempts for debugging
        console.log(`Redirect callback - URL: ${url}, Base URL: ${baseUrl}`)

        // Ensure proper redirect handling
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`
        } else if (new URL(url).origin === baseUrl) {
          return url
        }
        return baseUrl
      } catch (error) {
        console.error("Redirect callback error:", error)
        return baseUrl
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  // Add CSRF protection
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  logger: {
    error(code, metadata) {
      console.error(`[next-auth][error][${code}]`, metadata)
    },
    warn(code) {
      console.warn(`[next-auth][warn][${code}]`)
    },
    debug(code, metadata) {
      console.debug(`[next-auth][debug][${code}]`, metadata)
    },
  },
}
