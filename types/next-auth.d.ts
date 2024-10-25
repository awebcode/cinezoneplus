import type { User } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: User & { emailVerified?: boolean; watchListCount: number }

    backendTokens: {
      accessToken: string
      refreshToken: string
      expiresAccessTokenAt: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number
      email: string
      name: string
    }

    backendTokens: {
      accessToken: string
      refreshToken: string
      expiresAccessTokenAt: number
    }
  }
}
